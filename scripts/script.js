//accessing all elements
const subject = document.getElementById("subject");
const qtext = document.getElementById("qtext");
const subBtn = document.getElementById("submit");
const qlist = document.getElementById("qlist");

//Variables
var id = 0;

subject.value = "Sample 1";
qtext.value = "This is a sample Question asked";

//Add Question
subBtn.addEventListener("click", () => {
	if (subject.value == "" || qtext.value == "") {
		return;
	}

	let sub = subject.value;
	let question = qtext.value;
	addNewQuestion(sub, question);
	subject.value = "";
	qtext.value = "";
});

//add new question to list
function addNewQuestion(sub, question) {
	id++;
	//Create div
	let newList = document.createElement("div");
	newList.setAttribute("id", `qid${id}`);
	newList.setAttribute("class", "quest");

	//Create Subject header
	let subhead = document.createElement("h2");
	subhead.setAttribute("id", `subid${id}`);
	subhead.setAttribute("class", "sub");
	subhead.innerText = sub;

	//Create question text
	let newq = document.createElement("p");
	newq.setAttribute("id", `pid${id}`);
	newq.setAttribute("class", "qpara");
	newq.innerText = question;

	//appending child
	newList.appendChild(subhead);
	newList.appendChild(newq);
	qlist.appendChild(newList);

	addToStorage(id, sub, question);
}

//add to local Storage
function addToStorage(id, sub, question) {
	let obj = { subject: sub, question: question };
	obj = JSON.stringify(obj);
	localStorage.setItem(id, obj);
	localStorage.setItem(0, id);
}

function load() {
	let size = localStorage.getItem(0);
	for (let i = 1; i <= size; i++) {
		let obj = localStorage.getItem(i);
		obj = JSON.parse(obj);
		addNewQuestion(obj.subject, obj.question);
	}
}
