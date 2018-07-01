// highlight active tab
var pathname = window.location.pathname;
$('.nav > li > a[href="'+pathname+'"]').addClass('active');


// scrape button event handler
$("#scrape-button").on("click", function() {
    console.log("you clicked scrape!")
    $.get("/scrape", () => {
        console.log("scrape complete");
        location.href = "/articles"
    })
})

// save-article button event handler
$(document).on("click",".js-saveUnsave", function() {
    const articleId = $(this).attr("data-aid");
    const databaseId = $(this).attr("data-dbid");
    const action = $(this).attr("data-action");
    console.log("you clicked save article!\nArticle id:", articleId,"\n database id:", databaseId)
    $.ajax({
        url: "/articles/"+action+"/"+databaseId,
        method: "PUT"
    }).then((result) => {
        console.log(result)
        location.reload();
    })
})

// save-article button event handler - using ES-6 arrow notation
// "this" now refers to the document, so need to use event.currentTarget to get button
// $(document).on("click",".js-save", (event) => {
//     const articleId = event.currentTarget.getAttribute("data-aid");
//     console.log("you clicked save article!\nArticle id:", articleId)
// })

// save-article button event handler - using ES-6 arrow notation
// "this" now refers to the document, so need to use event.currentTarget to get button
// $(document).on("click",".js-save", (event) => {
//     const articleId = $(event.currentTarget).attr("data-aid");
//     console.log("you clicked save article!\nArticle id:", articleId)
// })

// see notes button event handler
$(document).on("click",".js-note", function() {
    const articleId = $(this).attr("data-aid");
    const databaseId = $(this).attr("data-dbid");
    //const action = $(this).attr("data-action");
    console.log("See notes\nArticle id:", articleId,"\nDatabase id:", databaseId)
    location.href= "/seenotes/"+databaseId
    // $.ajax({
    //     url: "/seenotes/"+databaseId,
    //     method: "GET"
    // }).then((result) => {
    //     location.href = "/articles"
    // })
})

// add note button event handler
$(document).on("click",".js-addNote", function() {
    const articleId = $(this).attr("data-aid");
    const databaseId = $(this).attr("data-dbid");
    //const action = $(this).attr("data-action");
    console.log("add note \nArticle id:", articleId,"\nDatabase id:", databaseId)
    $("#add-note-modal").modal('show')
})

// save note button event handler
$(document).on("click","#save-note-button", function() {
    const articleDatabaseId = $(this).attr("data-dbid");
    //const action = $(this).attr("data-action");
    console.log("save note \nArticle Database id:", articleDatabaseId)
    const noteTitle = $("#note-title").val();
    const noteContent = $("#note-content").val();
    console.log("Title: ", noteTitle,"\nContent: ", noteContent)
    const postBody = {
        artId: articleDatabaseId,
        title: noteTitle,
        content: noteContent
    }
    $.ajax({
        url: "/savenote",
        method: "POST",
        data: postBody 
    }).then((result) => {
        console.log("article saved")
        //console.log(result)
        //location.reload();
    })


})
