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

//Images
const upicon = document.createElement("img");
upicon.setAttribute("src", "./img/upvote.png");
const downicon = document.createElement("img");
downicon.setAttribute("src", "./img/downvote.png");
const favicon = document.createElement("img");
favicon.setAttribute("src", "./img/fav.png");

//Variables
let id = 0;
let cid = 1;

subject.value = "Sample 1";
qtext.value = "This is a sample Question asked";

//On Load
function load() {
	// enter.style.display = "none";
	// resolve.style.display = "flex";
	let size = localStorage.getItem(0);
	id = size;
	for (let i = 1; i <= size; i++) {
		let obj = localStorage.getItem(i);
		if (obj) {
			obj = JSON.parse(obj);
			addQuestion(obj.subject, obj.question, i);
		}
	}
}

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
	addQuestion(sub, question, id);
	addToStorage(id, sub, question);
}

//add question to HTML
function addQuestion(sub, question, id) {
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

//Resolve
function onResolve(qid) {
	enter.style.display = "none";
	resolve.style.display = "flex";

	//change function of resolve button
	let resolveBtn = document.getElementById("resolveBtn");
	resolveBtn.setAttribute("onclick", `onResolveBtn(${qid})`);

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

	commentBtn.setAttribute("onclick", `onComment(${qid})`);
}

//Resolve button
function onResolveBtn(qid) {
	//removing from local storage
	localStorage.removeItem(qid);

	//removing from HTML
	let q = document.getElementById(`qid${qid}`);
	q.remove();

	//changing display
	enter.style.display = "flex";
	resolve.style.display = "none";
}

//adding response to table
function addResponse(qid) {
	let obj = localStorage.getItem(qid);
	obj = JSON.parse(obj);
	let resp = document.getElementById("table");

	for (let i = 0; i < obj.responses.length; i++) {
		//Row
		let row = document.createElement("div");
		row.setAttribute("class", "row");

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
		row.appendChild(div);

		//Score
		let score = document.createElement("p");
		score.setAttribute("class", "score");
		score.innerText = `Score: ${obj.responses[i].upvote}`;
		row.appendChild(score);

		//Div for upvote, downvote and fav
		let div2 = document.createElement("div");
		div2.setAttribute("class", "buttonsWrapper");

		//Upvote
		let upvote = document.createElement("button");
		upvote.setAttribute("class", "upvote");
		upvote.setAttribute("onclick", `onUpvote(${qid}, ${i})`);
		let upi = upicon.cloneNode(true);
		upvote.appendChild(upi);
		div2.appendChild(upvote);

		//Downvote
		let downvote = document.createElement("button");
		downvote.setAttribute("class", "downvote");
		downvote.setAttribute("onclick", `onDownvote(${qid}, ${i})`);
		let downi = downicon.cloneNode(true);
		downvote.appendChild(downi);
		div2.appendChild(downvote);

		//Favorite
		let fav = document.createElement("button");
		fav.setAttribute("class", "fav");
		fav.setAttribute("onclick", `onFav(${qid}, ${i})`);
		let favi = favicon.cloneNode(true);
		fav.appendChild(favi);
		div2.appendChild(fav);

		row.appendChild(div2);
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
	localStorage.setItem(cid, obj);

	onResolve(cid);
}

//Display question form
function displayQForm() {
	enter.style.display = "flex";
	resolve.style.display = "none";
}

//Search bar
function search() {
	let search = document.getElementById("search").value;
	search = search.toLowerCase();
	let q = document.getElementsByClassName("quest");
	for (let i = 0; i < q.length; i++) {
		let sub = document.getElementById(`subid${i + 1}`).innerText;
		sub = sub.toLowerCase();
		let ques = document.getElementById(`pid${i + 1}`).innerText;
		ques = ques.toLowerCase();
		if (sub.includes(search) || ques.includes(search)) {
			q[i].style.display = "flex";
		} else {
			q[i].style.display = "none";
		}
	}
}

// localStorage.clear();

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
