let note = {
    id: "",
    noteTitle: "",
    noteContent: "",
    set noteId(noteId) { //todo refactor: make consistent naming: e.g. noteId, noteTitle, noteContent. Probably it requires changes in controller or service
        this.id = noteId
    },
    set title(title) {
        this.noteTitle = title;
    },
    set content(content) {
        this.noteContent = content;
    }
};

//Refresh page(also notes titles) after closure of modal because a note might have been edited
$(document).on('hidden.bs.modal','#view-modal', function () {
    window.location.reload();
})

function viewNote(id) {
    note.noteId = id;
    const response = fetch('view-modal?id=' + id, {
        method: 'GET',
        cache: 'no-cache'
    });
    response
        .then((r) => r.json())
        .then((json) => {
                console.log(json);
                note.title = json.noteTitle;
                note.content = json.noteContent;
                document.getElementById("mod-title").innerHTML = json.noteTitle;
                document.getElementById("mod-content").innerHTML = json.noteContent;

            }
        )
        .catch(error => console.error(error))

}

function editNote() {
    console.log("editNote JS function call");
    document.getElementById("mod-title").innerHTML = "<input type='text' class='form-control' value='" + note.noteTitle + "'>";
    let noteContentTextarea = document.createElement("TEXTAREA");
    // note.noteContent = note.noteContent.replace(/<\/br>\//g, "\n");
    note.noteContent = note.noteContent.split("</br>").join("\n");
    noteContentTextarea.value = note.noteContent;
    noteContentTextarea.className = "form-control";
    noteContentTextarea.rows= 6;
    noteContentTextarea.cols= 50;
    document.getElementById("mod-content").innerHTML="";
    document.getElementById("mod-content").insertAdjacentElement('afterbegin', noteContentTextarea);
    document.getElementById("button-edit").innerHTML = "<button class=\"btn btn-info\" onclick=\"updateNote()\" type=\"button\">Save</button>";
}

function updateNote() {
    note.noteTitle = document.getElementById("mod-title").getElementsByTagName("input")[0].value;
    note.noteContent = document.getElementById("mod-content").getElementsByTagName("textarea")[0].value;
    note.noteContent=note.noteContent.split("\n").join("</br>");
    const request = fetch('view-modal', {
        method: 'POST',
        body: JSON.stringify(note),
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
    makeViewNoteLook()
}

//back to note look from before edit
function makeViewNoteLook() {
    document.getElementById("mod-title").innerHTML = note.noteTitle;
    document.getElementById("mod-content").innerHTML = note.noteContent;
    document.getElementById("button-edit").innerHTML = "<button class=\"btn btn-info\" onclick=\"editNote()\" type=\"button\">Edit</button>";
}
