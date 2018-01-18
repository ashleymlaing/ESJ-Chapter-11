//function parseExpression takes a string and gives out an object holding the data structure for the expression at the start of the string

//first part of parser
function parseExpression(program) {
  program = skipSpace(program);
  var match, expr;
  if(match = /^"([^"]*)")/.exec(program)){
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+/b/.exec(program)) {
    expr = {}
  }
}
