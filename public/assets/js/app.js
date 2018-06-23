// scrape button event handler
$("#scrape-button").on("click", () => {
    console.log("you clicked scrape!")
    $.get("/scrape", () => {
        console.log("scrape complete");
        location.href = "/articles"
    })
})