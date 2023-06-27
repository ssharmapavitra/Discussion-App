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
	let list = [];
	for (let i = 1; i <= size; i++) {
		let obj = localStorage.getItem(i);
		if (obj) {
			obj = JSON.parse(obj);
			list.push(obj);
		}
	}
	list = qSort(list);
	qlist.innerHTML = "";
	for (let i = 0; i < list.length; i++) {
		addQuestion(
			list[i].subject,
			list[i].question,
			list[i].id,
			list[i].upvote,
			list[i].downvote,
			list[i].favorite,
			list[i].time
		);
	}
}

//Interval to load page again
const timeOut = setInterval(() => {
	load();
}, 10000);

//Add Question
subBtn.addEventListener("click", () => {
	let subV = subject.value;
	let qtextV = qtext.value;
	subV = subV.trim();
	qtextV = qtextV.trim();

	if (subV == "" || qtextV == "") {
		return;
	}

	addNewQuestion(subV, qtextV);
	subject.value = "";
	qtext.value = "";
});

//add new question to list
function addNewQuestion(sub, question) {
	id++;
	addQuestion(sub, question, id, 0, 0, false);
	addToStorage(id, sub, question);
}

//add question to HTML
function addQuestion(sub, question, id, upvotec, downvotec, favor, timeC) {
	//Create div
	let newList = document.createElement("div");
	newList.setAttribute("id", `qid${id}`);
	newList.setAttribute("class", "quest");
	newList.setAttribute("onclick", `onResolve(${id})`);

	//Create Subject Div
	let subDiv = document.createElement("div");
	subDiv.setAttribute("class", "subDiv");

	//Create Question Div
	let qDiv = document.createElement("div");
	qDiv.setAttribute("class", "qDiv");

	//Create Subject header
	let subhead = document.createElement("h2");
	subhead.setAttribute("id", `subid${id}`);
	subhead.setAttribute("class", "sub");
	subhead.innerText = sub;
	subDiv.appendChild(subhead);

	//Create question text
	let newq = document.createElement("p");
	newq.setAttribute("id", `pid${id}`);
	newq.setAttribute("class", "qpara");
	newq.innerText = question;
	qDiv.appendChild(newq);

	//div for upvote, downvote and fav
	let updown = document.createElement("div");
	updown.setAttribute("class", "favQ");

	//Create upvote button
	let upvote = document.createElement("button");
	upvote.setAttribute("class", "upvote");
	upvote.setAttribute("onclick", `onUpvoteQ(${id}); event.stopPropagation()`);
	let upi = upicon.cloneNode(true);
	upvote.appendChild(upi);
	//adding upvote count
	let upvotecount = document.createElement("p");
	upvotecount.setAttribute("class", "upvotecount");
	upvotecount.setAttribute("id", `upvotecount${id}`);
	upvotecount.innerText = upvotec;
	upvote.appendChild(upvotecount);

	//Create downvote button
	let downvote = document.createElement("button");
	downvote.setAttribute("class", "downvote");
	downvote.setAttribute(
		"onclick",
		`onDownvoteQ(${id}); event.stopPropagation()`
	);
	let downi = downicon.cloneNode(true);
	downvote.appendChild(downi);
	//adding downvote count
	let downvotecount = document.createElement("p");
	downvotecount.setAttribute("class", "downvotecount");
	downvotecount.setAttribute("id", `downvotecount${id}`);
	downvotecount.innerText = downvotec;
	downvote.appendChild(downvotecount);

	//Adding fav button
	let fav = document.createElement("button");
	if (favor) {
		fav.setAttribute("class", "fav favSelected");
	} else fav.setAttribute("class", "fav");
	fav.setAttribute("id", `fav${id}`);
	fav.setAttribute("onclick", `onQFav(${id}); event.stopPropagation()`);
	let favi = favicon.cloneNode(true);
	fav.appendChild(favi);

	//Adding time of question
	let time = document.createElement("p");
	time.setAttribute("class", "time");
	time.setAttribute("id", `time${id}`);
	time.innerText = getTime(timeC);
	qDiv.appendChild(time);

	//appending upvote, downvote and fav
	updown.appendChild(upvote);
	updown.appendChild(downvote);
	updown.appendChild(fav);

	//appending child
	subDiv.appendChild(updown);
	newList.appendChild(subDiv);
	newList.appendChild(qDiv);
	qlist.appendChild(newList);
}

//add subject and question to local Storage
function addToStorage(id, sub, question) {
	let obj = {
		id: id,
		subject: sub,
		question: question,
		upvote: 0,
		downvote: 0,
		score: 0,
		time: new Date(),
		favorite: false,
		responses: [],
	};
	obj = JSON.stringify(obj);
	localStorage.setItem(id, obj);
	localStorage.setItem(0, id);
}

//On Question Favoutite
function onQFav(qid) {
	let fav = document.getElementById(`fav${qid}`);
	let obj = localStorage.getItem(qid);
	obj = JSON.parse(obj);
	if (obj.favorite) {
		obj.favorite = false;
		fav.setAttribute("class", "fav favQ");
	} else {
		obj.favorite = true;
		fav.setAttribute("class", "fav favQ favSelected");
	}
	obj = JSON.stringify(obj);
	localStorage.setItem(qid, obj);
	load();
}

//On Upvote Question
function onUpvoteQ(qid) {
	let obj = localStorage.getItem(qid);
	obj = JSON.parse(obj);
	obj.upvote++;
	obj.score++;
	obj = JSON.stringify(obj);
	localStorage.setItem(qid, obj);
	load();
}

//On Downvote Question
function onDownvoteQ(qid) {
	let obj = localStorage.getItem(qid);
	obj = JSON.parse(obj);
	obj.downvote++;
	obj.score--;
	obj = JSON.stringify(obj);
	localStorage.setItem(qid, obj);
	load();
}

//Get time
function getTime(time) {
	let date = new Date(time);
	let now = new Date();
	let diff = now - date;
	let sec = Math.floor(diff / 1000);
	let min = Math.floor(sec / 60);
	let hour = Math.floor(min / 60);
	let day = Math.floor(hour / 24);
	let month = Math.floor(day / 30);
	let year = Math.floor(month / 12);
	if (year > 0) {
		return `${year} year ago`;
	} else if (month > 0) {
		return `${month} month ago`;
	} else if (day > 0) {
		return `${day} day ago`;
	} else if (hour > 0) {
		return `${hour} hour ago`;
	} else if (min > 0) {
		return `${min} min ago`;
	} else if (sec > 0) {
		return `${sec} sec ago`;
	} else {
		return `Just now`;
	}
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

		//Div for upvote, downvote and fav
		let div2 = document.createElement("div");
		div2.setAttribute("class", "buttonsWrapper");

		//Upvote
		let upvote = document.createElement("button");
		upvote.setAttribute("class", "upvote");
		upvote.setAttribute("onclick", `onUpvote(${qid}, ${i})`);
		let upi = upicon.cloneNode(true);
		upvote.appendChild(upi);
		//add upvote count
		let upcount = document.createElement("p");
		upcount.setAttribute("class", "upcount");
		upcount.innerText = obj.responses[i].upvote;
		upvote.appendChild(upcount);
		div2.appendChild(upvote);

		//Downvote
		let downvote = document.createElement("button");
		downvote.setAttribute("class", "downvote");
		downvote.setAttribute("onclick", `onDownvote(${qid}, ${i})`);
		let downi = downicon.cloneNode(true);
		downvote.appendChild(downi);
		//add downvote count
		let downcount = document.createElement("p");
		downcount.setAttribute("class", "downcount");
		downcount.innerText = obj.responses[i].downvote;
		downvote.appendChild(downcount);
		div2.appendChild(downvote);

		//Favorite
		let fav = document.createElement("button");
		//checking if favorite or not
		if (obj.responses[i].favorite) {
			fav.setAttribute("class", "fav favSelected");
		} else fav.setAttribute("class", "fav");

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

	let nameV = nameIp.value;
	let commentV = comment.value;
	nameV = nameV.trim();
	commentV = commentV.trim();

	//getting values from boxes
	if (nameV == "" || commentV == "") {
		alert("Please Enter a value");
		return;
	}

	response.name = nameV;
	response.response = commentV;
	response.score = 0;
	response.downvote = 0;
	response.upvote = 0;
	response.favorite = false;
	obj.responses.push(response);
	obj = JSON.stringify(obj);
	console.log(obj);
	localStorage.setItem(cid, obj);

	onResolve(cid);
	//clear values
	nameIp.value = "";
	comment.value = "";
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
			//highlighting searchtext
			let subIndex = sub.indexOf(search);
			if (subIndex >= 0) {
				let subText = sub.substring(subIndex, subIndex + search.length);
				sub = sub.replace(subText, `<mark>${subText}</mark>`);
			}

			let quesIndex = ques.indexOf(search);
			if (quesIndex >= 0) {
				let quesText = ques.substring(quesIndex, quesIndex + search.length);
				ques = ques.replace(quesText, `<mark>${quesText}</mark>`);
			}
			document.getElementById(`subid${i + 1}`).innerHTML = sub;
			document.getElementById(`pid${i + 1}`).innerHTML = ques;

			q[i].style.display = "flex";
		} else {
			q[i].style.display = "none";
		}
	}
}

//Upvote
function onUpvote(qid, rid) {
	let obj = localStorage.getItem(qid);
	obj = JSON.parse(obj);
	obj.responses[rid].score++;
	obj.responses[rid].upvote++;
	obj = rSort(obj);
	obj = JSON.stringify(obj);
	localStorage.setItem(qid, obj);
	onResolve(qid);
}

//Downvote
function onDownvote(qid, rid) {
	let obj = localStorage.getItem(qid);
	obj = JSON.parse(obj);
	obj.responses[rid].score--;
	obj.responses[rid].downvote++;
	obj = rSort(obj);
	obj = JSON.stringify(obj);
	localStorage.setItem(qid, obj);
	onResolve(qid);
}

//Favorite
function onFav(qid, rid) {
	let obj = localStorage.getItem(qid);
	obj = JSON.parse(obj);
	obj.responses[rid].favorite = !obj.responses[rid].favorite;
	obj = rSort(obj);
	obj = JSON.stringify(obj);
	localStorage.setItem(qid, obj);
	onResolve(qid);
}

//Sorting the responses
function rSort(obj) {
	//sorting responses according to upvotes and fav
	obj.responses.sort((a, b) => {
		if (a.favorite && !b.favorite) {
			return -1;
		} else if (!a.favorite && b.favorite) {
			return 1;
		} else if (a.score > b.score) {
			return -1;
		} else if (a.score < b.score) {
			return 1;
		} else {
			return 0;
		}
	});

	return obj;
}

//Sorting the questions
function qSort(obj) {
	//sorting responses according to fav
	obj.sort((a, b) => {
		if (a.favorite && !b.favorite) {
			return -1;
		} else if (!a.favorite && b.favorite) {
			return 1;
		} else if (a.score > b.score) {
			return -1;
		} else if (a.score < b.score) {
			return 1;
		} else {
			return 0;
		}
	});

	return obj;
}

//Clearing local storage
// localStorage.clear();

/*
Schema
{
 id: {
	id: " ",
	sub: " ",
	question : " ".
	upvote : " ",
	favorite: " ",
	time : " ",
	responses :[
		{ 
			name: " ",
			response: " ",
			upvote : " ",
			downvote : " ",
			score : " ",
			favorite: " ",
		}.....{}
	]
 }
}

*/
