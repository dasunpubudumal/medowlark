# Course notes for Web Development with Node and Express - Ethan Brown.

I will add the course notes in this Readme file.

1. Difference between POST and GET reqests.


* GET - Requests a resource from the server. This might be a webpage or any other resource.

* POST - Submits data to be processed.

This is an example for a POST request.

~~~~app.post('/contest/vacation-photo/:year/:month', function(req,res){ //:year and :month are specified as 'route parameters'
    var form = formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303,'/404');    //Redirect to an error page. Not necessarily an 404.
        console.log('recieved fields.');
        console.log(fields);
        console.log('recieved files');
        console.log(files);
        //Now you can store these in a database or do anything here. 
        res.redirect(303,'/ thank-you'); //Finally redirect to thank-you page.
    });

}); 
~~~~

This is an example for a GET request.

~~~~
app.get('/newsletter', function (req, res) {
    res.render('newsletter', { csrf: 'CSRF token goes here' });
});
~~~~

