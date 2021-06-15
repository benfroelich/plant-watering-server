function hello()
{
    console.log("hello from diagnostics.js");
}

hello();

$.get('/diagnostics-update', {content: "TODO"}, new_data => {
    console.log(`new_data = ${new_data}`);
});

