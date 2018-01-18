//function parseExpression takes a string and gives out an object holding the data structure for the expression at the start of the string

//first part of parser
function parseExpression(program) {
  program = skipSpace(program);
  //using regexp to check the 'elements' to see if its either string, word, number
  var match, expr;
  if(match = /^"([^"]*)")/.exec(program)){
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+/b/.exec(program)) {
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
