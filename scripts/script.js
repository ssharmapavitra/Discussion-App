//accessing all elements
const subject = document.getElementById("subject");
const qtext = document.getElementById("qtext");
const subBtn = document.getElementById("submit");
const qlist = document.getElementById("qlist");
const enter = document.getElementById("enter");
const resolve = document.getElementById("resolve");
const selectedQ = document.getElementById("selectedQ");
const commentBtn = document.getElementById("rSubmit");
const nameIp = document.getElementById("name");
const comment = document.getElementById("comment");

//Variables
var id = 0;
let cid = 1;

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
	addQuestion(sub, question);
	addToStorage(id, sub, question);
}

//add question to HTML
function addQuestion(sub, question) {
	id++;
	//Create div
	let newList = document.createElement("div");
	newList.setAttribute("id", `qid${id}`);
	newList.setAttribute("class", "quest");
	newList.setAttribute("onclick", `onResolve(${id})`);

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
}

//add subject and question to local Storage
function addToStorage(id, sub, question) {
	let obj = { subject: sub, question: question, responses: [] };
	obj = JSON.stringify(obj);
	localStorage.setItem(id, obj);
	localStorage.setItem(0, id);
}

function load() {
	let size = localStorage.getItem(0);
	for (let i = 1; i <= size; i++) {
		let obj = localStorage.getItem(i);
		obj = JSON.parse(obj);
		addQuestion(obj.subject, obj.question);
	}
}

//Resolve
function onResolve(qid) {
	enter.style.display = "none";
	resolve.style.display = "flex";

	//Question
	let question = document.getElementById(`qid${qid}`).cloneNode(true);
	question.style.border = "0px";
	selectedQ.innerHTML = "";
	selectedQ.appendChild(question);

	//clearing response
	let table = document.getElementById("table");
	table.innerHTML = "";

	//Response
	addResponse(qid);

	commentBtn.setAttribute("onclick", `onComment(${id})`);
}

//adding response to table
function addResponse(qid) {
	let obj = localStorage.getItem(qid);
	obj = JSON.parse(obj);
	let resp = document.getElementById("table");

	for (let i = 0; i < obj.responses.length; i++) {
		//Div for response and name
		let div = document.createElement("div");
		div.setAttribute("class", "response");

		//Name
		let name = document.createElement("h3");
		name.innerText = obj.responses[i].name;
		div.appendChild(name);

		//Response
		let response = document.createElement("p");
		response.innerText = obj.responses[i].response;
		div.appendChild(response);

		//response
		let row = document.createElement("tr");
		let respon = document.createElement("td");
		respon.appendChild(div);
		row.appendChild(respon);

		//upvote
		let upvote = document.createElement("td");
		upvote.innerText = obj.responses[i].upvote;
		row.appendChild(upvote);

		//downvote
		let downvote = document.createElement("td");
		downvote.innerText = obj.responses[i].favorite;
		row.appendChild(downvote);

		//favorite
		let favorite = document.createElement("td");
		favorite.innerText = obj.responses[i].favorite;
		row.appendChild(favorite);

		//appending row
		resp.appendChild(row);
	}
}

//Adding event listner to button
function onComment(cid) {
	let obj = localStorage.getItem(cid);
	obj = JSON.parse(obj);
	let response = {};

	//getting values from boxes
	if (nameIp.value == "" || comment.value == "") {
		alert("Please Enter a value");
		return;
	}

	response.name = nameIp.value;
	response.response = comment.value;
	response.upvote = 0;
	response.favorite = false;
	obj.responses.push(response);
	obj = JSON.stringify(obj);
	console.log(obj);
	localStorage.setItem(id, obj);

	onResolve(cid);
}

localStorage.clear();

/*
Schema
{
 id: {
	sub: " ",
	question : " ".
	responses :[
		{ 
			name: " ",
			response: " ",
			upvote : " ",
			favorite: " ",
		}.....{}
	]
 }
}

*/
