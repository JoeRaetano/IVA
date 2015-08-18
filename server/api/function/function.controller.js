/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Functions = require('./function.model');
var natural = require('natural');


// Get list of things
exports.index = function(req, res) {
  Functions.find(function (err, c2s) {
    if(err) { return handleError(res, err); }
    return res.json(200, c2s);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Functions.findById(req.params.id, function (err, c2) {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    return res.json(c2);
  });
};

exports.getPids = function(req, res) {
  var id = req.params.id.toString()

  Functions.find({pid : id}, function (err, c2)
  {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    return res.json(c2);
  });
};

exports.getTags = function(req,res)
{
  Functions.find
  (
      function(err, functions)
      {
        var tmp_tags = {};
        var groups = [];
        var tags = {};
        
        for( var i = 0; i <  functions.length; i++)
        {
          var func = functions[i];
          
          for( var j = 0; j < func.tags.length; j++ )
          {
            var tag = func.tags[j];
            
            if( tmp_tags[tag[0]] == undefined )
            {
              tmp_tags[tag[0]] = [];
              tmp_tags[tag[0]].push(tag);
            }
            
            if( groups.indexOf(tag[0]) == -1 )
            {
              groups.push(tag[0]);
            }
            
            if( tmp_tags[tag[0]].indexOf( tag ) == -1 )
            {
              tmp_tags[tag[0]].push(tag);
              tmp_tags[tag[0]].sort();
            }
          }
        }
        
        groups.sort()
        for( var i = 0; i < groups.length; i++ )
        {
          tags[groups[i]] = tmp_tags[groups[i]]
        }
        return res.json(200, tags);
      }
  );
};


// Creates a new thing in the DB.
exports.create = function(req, res) {
  natural.PorterStemmer.attach();
  req.body.tags = req.body.tags.toLowerCase().tokenizeAndStem().sort()
  
  Functions.create(req.body, function(err, c2) {
    if(err) { return handleError(res, err); }
    return res.json(201, c2);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Functions.findById(req.params.id, function (err, c2) {
    if (err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }

    var updated = _.merge(c2, req.body, function(a, b)
      {
        if (_.isArray(a)) {
          return a.concat(b);}}
    );
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, c2);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Functions.findById(req.params.id, function (err, c2) 
  {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    
    c2.remove(function(err) 
    {
      if(err) { return handleError(res, err); }
      
      return res.send(204);
    });
  });
};

exports.query = function(req, res)
{
  var components = [];
  var tokenizer = new natural.TreebankWordTokenizer();
  var query = {};
  
  components = tokenizer.tokenize(req.params.expression);
  console.log(components)
  query = parseExpression(components);

  Functions.find
  (
      query,
      function (err, c2)
      {
        console.log("C2" + c2);
        return res.json(c2);
      }
  );
};

function parseExpression( expression )
{
  var logic = ["(", ")", "AND", "OR", "NOT"];
  var operation = "";
  var query = {};
  var components = [];
  var paren_stack = [];
  
  // Handle case when array is empty
  if( expression.length == 0 )
  {
    return {};
  }
  
  // Handle case when array has one word in it
  if( expression.length == 1 && logic.indexOf( expression[0] ) == -1 )
  {
    return {tags: expression[0]};
  }
  
  // Iterate over all of the words in the expression
  for( var i = 0; i < expression.length; i++ )
  {
    switch( expression[i] ) 
    {
      case "AND":
        if (operation == "" || operation == "$and") 
        {
          operation = "$and";
        }
        else 
        {
          console.log("there was an error: Mismatched logic operators at AND")
        }

        break;
      case "OR":
        if (operation == "" || operation == "$or") 
        {
          operation = "$or";
        }
        else 
        {
          console.log("there was an error: Mismatched logic operators at OR")
        }

        break;
      case "NOT":
        if (operation == "" || operation == "$nin") 
        {
          var tmp = {};
          tmp["$nin"] = [expression[i + 1]] ;
          query["tags"] = tmp;
          return query;
        }
        else
        { console.log( "there was an error: Mismatched logic operators at NOT") }
          
        break;
      case "(":
        var recursive_components = [];
          
        paren_stack.push("(");
        while( paren_stack.length > 0 )
        {
          i++;
          recursive_components.push(expression[i]);
          if( expression[i] == ")" )
          { paren_stack.pop() }
          if( expression[i] == "(" )
          { paren_stack.push("(") }
          console.log("recurs " + recursive_components);
        }
        recursive_components.pop();
          
        components.push( parseExpression(recursive_components) );
        break;
      case ")":
        console.log( "there was an error: Mismatched logic operators at )")
        break;
      default:
        components.push( {tags: expression[i]});
                
    }
  }
  query[operation] = components;
  return query;
}

function handleError(res, err) {
  return res.send(500, err);
}
