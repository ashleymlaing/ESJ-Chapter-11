//function parseExpression takes a string and gives out an object holding the data structure for the expression at the start of the string

//first part of parser
function parseExpression(program) {
  program = skipSpace(program);
  //using regexp to check the 'elements' to see if its either string, word, number
  var match, expr;
  if(match = /^"([^"]*)"/.exec(program)){
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};
  } else if (match = /^[^\s(),"]+/.exec(program)) {
    expr = {type: "word", name: match[0]};
  } else {
    throw new SyntaxError("Unexpected syntax: " + program);
  }

  return parseApply(expr, program.slice(match[0].length));
}

//helps cut whitespace
function skipSpace(string) {
  var first = string.search(/\S/);
  if (first == -1){
    return "";
  }
  return string.slice(first);
}

//parseApply

//this program will check to see if there is a () to be a application/function or if its just a word

function parseApply(expr, program) {
  program = skipSpace(program);
  if (program[0] != "(") {
    return {expr: expr, rest: program};
  }

  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator:expr, args: []};
  while (program[0] != ")") {
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",") {
      program = skipSpace(program.slice(1));
    } else if (program[0] != ")") {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  return parseApply(expr, program.slice(1));
}

//runs all the parse functions in this one
function parse(program) {
  var result = parseExpression(program);
  if (skipSpace(result.rest).length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }
  return result.expr;
}

var specialForms = Object.create(null);

function evaluate(expr, env) {
  switch(expr.type){
    case "value":
      return expr.value;

    case "word":
      if (expr.name in env) {
        return env[expr.name];
      } else {
        throw new ReferenceError("Undefined variable: " + expr.name);
      }
    case "apply":
      if(expr.operator.type == "word" && expr.operator.name in specialForms){
        return specialForms[expr.operator.name](expr.args, env);
      }
      var op = evaluate(expr.operator, env);
      if (typeof op != "function") {
        throw new TypeError("Applying a non-function.");
      }
      return op.apply(null, expr.args.map(function(arg){
        return evaluate(arg, env);
      }));
  }
}

specialForms["if"] = function(args, env) {
  if(args.length != 3){
    throw new SyntaxError("Bad number of args to if");
  }
  if (evaluate(args[0],env) !== false) {
    return evaluate(args[1],env);
  } else {
    return evaluate(args[2], env);
  }
};
