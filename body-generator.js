/*

	Human Body Generator v0.9.0 - Builds a randomized human being in SVG.
	Copyright (C) 2018 Sara Gleghorn


    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/



//Functions to retrieve data from UI///////////////////////////////////////////
function getGender(){
	"use strict"
	var result = "blendsimple" //default if no options selected
	//check all genders, and overwrite default with the checked gender
    var genders = document.getElementsByName("gender");
    var i;
    for (i = 0; i < genders.length; i = i + 1) {
        if (genders[i].checked) {
            result = genders[i].value;
        }
    }
	return result
}
function getNum(strLibrary, strList,strPosition){
	//Retrieves measurements from the user interface, 
	//using by the outer ID and inner class
	"use strict"
	var eLibrary = document.querySelector("details#" + strLibrary);
	var eList = eLibrary.querySelector("form[name=" + strList + "]");
	var ePos = eList.querySelector("input[name=" + strPosition + "]");
	var result = ePos.valueAsNumber;
	return result;
}

function getInputDimensionsXYZ(bodyPart,myGender){
	//get method
	var options = document.getElementById(bodyPart + "method")
	var methodselected
	for (var i=0; i < options.length; i++) {
		if (options[i].selected)
			methodselected = options[i].value;
	}
	
	result = {
		v:[
			getNum(bodyPart, myGender, "x"),
			getNum(bodyPart, myGender, "y"),
			getNum(bodyPart, myGender, "z")
		],
		vsd:[
			getNum(bodyPart, myGender, "x_sd"),
			getNum(bodyPart, myGender, "y_sd"),
			getNum(bodyPart, myGender, "z_sd")
		],
		vmin:[
			getNum(bodyPart, myGender, "x_min"),
			getNum(bodyPart, myGender, "y_min"),
			getNum(bodyPart, myGender, "z_min")
		],
		vmax:[
			getNum(bodyPart, myGender, "x_max"),
			getNum(bodyPart, myGender, "y_max"),
			getNum(bodyPart, myGender, "z_max")
		],
		vmethod:[
			methodselected
		]
		/*vparent:[
			parentselected
		]*/
	}
	return result
}

function getInputDimensionsPoC(bodyPart,myGender){
	//get method
	var options = document.getElementById(bodyPart + "method")
	var methodselected
	for (var i=0; i < options.length; i++) {
		if (options[i].selected)
			methodselected = options[i].value;
	}
	/*var options = document.getElementById(bodyPart + "parent")
	var parentselected
	for (var i=0; i < options.length; i++) {
		if (options[i].selected)
			parentselected = options[i].value;
	}*/	
	
	result = {
		v:[
			getNum(bodyPart, myGender, "x"),
			getNum(bodyPart, myGender, "sr"), //side radius
			getNum(bodyPart, myGender, "sa"), //side angle
		],
		vsd:[
			getNum(bodyPart, myGender, "x_sd"),
			getNum(bodyPart, myGender, "sr_sd"),
			getNum(bodyPart, myGender, "sa_sd")
		],
		vmin:[
			getNum(bodyPart, myGender, "x_min"),
			getNum(bodyPart, myGender, "sr_min"),
			getNum(bodyPart, myGender, "sa_min")
		],
		vmax:[
			getNum(bodyPart, myGender, "x_max"),
			getNum(bodyPart, myGender, "sr_max"),
			getNum(bodyPart, myGender, "sa_max")
		],
		vmethod:[
			methodselected
		]

	}
	return result
}

//Math/////////////////////////////////////////////////////////////////////////
function randomGaussian(mu, sigma, vmin, vmax) {
    "use strict";
    var sigmaMod = 1.0;
	var maxloops = 3;
	var loopcounter = 0;
	var randomisedNumber = 0;
	do {
		randomisedNumber = mu + 2.0 * (sigma * sigmaMod) * (Math.random() + Math.random() + Math.random() - 1.5);
		if (randomisedNumber >= vmin && randomisedNumber <= vmax) {
			loopcounter = maxloops;
		} else {
			loopcounter = loopcounter + 1;
			console.log("rerun")
		}		
	} while (loopcounter < maxloops);
	return randomisedNumber
    //return mu + 2.0 * (sigma * sigmaMod) * (Math.random() + Math.random() + Math.random() - 1.5);
}

function makeXYZ(thisPart, parentx, parenty, parentz){
	
	"use strict"
	var x = 0;
    var y = 1;
    var z = 2;
	var v = "v"
	var vsd = "vsd"
	var vmin = "vmin"
	var vmax = "vmax"
	var vmethod = "vmethod"
	
	var alteredXYZ = [
		randomGaussian(
			thisPart[v][x], 
			thisPart[vsd][x],
			thisPart[vmin][x],
			thisPart[vmax][x]
		),
		randomGaussian(
			thisPart[v][y], 
			thisPart[vsd][y],
			thisPart[vmin][y],
			thisPart[vmax][y]
		),
		randomGaussian(
			thisPart[v][z], 
			thisPart[vsd][z],
			thisPart[vmin][z],
			thisPart[vmax][z]
		)
	];
	//Resize relative to parent, if neccessary.
	if (thisPart[vmethod][0] === "relative") {
		result = [
			parseInt(alteredXYZ[x] * parentx),
			parseInt(alteredXYZ[y] * parenty),
			parseInt(alteredXYZ[z] * parentz)
		];
		console.log(result)
	} else {
		result = [
			parseInt(alteredXYZ[x]),
			parseInt(alteredXYZ[y]),
			parseInt(alteredXYZ[z])
		];
	}
	return result
}

function makeXYZFromPoC(thispart, parentfront, parentside){
	"use strict"
	var x = 0;
    var y = 1;
    var z = 2;
	var fr = 0;
	var fa = 1;
	var sr = 2;
	var sa = 3;
	//function randomGaussian(mu, sigma, vmin, vmax) 
	var v = "v"
	var vsd = "vsd"
	var vmin = "vmin"
	var vmax = "vmax"
}

//Colours//////////////////////////////////////////////////////////////////////
function GradientReader(colorStops, gradientBox, toneBox){
	"use strict"
	var skinCanvas = gradientBox;
	var skinContext = skinCanvas.getContext('2d');
	var skinGradient = skinContext.createLinearGradient(0, 0, 512, 0);
	var i = 0;
	var cs;
	
	skinCanvas.width = 512;
	skinCanvas.height = 6;
	
	for(; cs = colorStops[i++];)
		skinGradient.addColorStop(cs.stop, cs.color);
	
	skinContext.fillStyle = skinGradient;
	skinContext.fillRect(0,0,512,6);
	
	return skinContext.getImageData(Math.random() * 512, 0, 1, 1).data;
	
}

function blendHardLight(fg, bg){ //http://www.simplefilter.de/en/basics/mixmods.html
	var i = 0;
	var fgAsPercent = [0, 0, 0, 0, 0, 0, 0, 0];
	var bgAsPercent = [0, 0, 0, 0, 0, 0, 0, 0];
	var blend = [0, 0, 0, 0, 0, 0, 0, 0];
	
	for(i = 0; i < fg.length; i++){
		fgAsPercent[i] = fg[i] / 255 //to get % of 1
		bgAsPercent[i] = bg[i] / 255
		if (fgAsPercent[i] <= 0.5) {
			blend[i] = parseInt(2 * fgAsPercent[i] * bgAsPercent[i] * 255)
		} else {
			blend[i] = parseInt((1 - 2 * (1 - fgAsPercent[i]) * (1 - bgAsPercent[i])) * 255)
		}	
	}
	
	return blend
	
}

function chooseColours(){
	"use strict"
	//display the gradients and selected colours
	var gradientBox = document.getElementById("skinvaluegradient")
	var toneBox = document.getElementById("skinvaluecolor")
	var skinValue = new GradientReader([{
		stop: 0.0,
		color: "rgb(17, 15, 26)"
	},{
		stop: 1.0,
		color: "rgb(242, 242, 242)"
	}],
	gradientBox, toneBox);
	toneBox.style.backgroundColor = "RGB(" + skinValue[0] + "," + skinValue[1] + "," + skinValue[2] + ")"
	
	var gradientBox = document.getElementById("skincolorgradient")
	var toneBox = document.getElementById("skincolorcolor")
	var skinTone = new GradientReader([{
		stop: 0.0,
		color: "rgb(20, 6, 1)"
	},{
		stop: 0.5,
		color: "rgb(133, 107, 82)"
	},{
		stop: 1.0,
		color: "rgb(251, 209, 209)"
	}],
	gradientBox, toneBox);
	toneBox.style.backgroundColor = "RGB(" + skinTone[0] + "," + skinTone[1] + "," + skinTone[2] + ")";
	
	//blend these colours together using Hard Light-ish model
	var skinColour = blendHardLight(skinValue, skinTone);
	
	/*
	//get eye colour
	var gradientBox = document.getElementById("eyecolorgradient")
	var toneBox = document.getElementById("eyecolorcolor")
	var eyeColour = new GradientReader([{
		stop: 0.0,
		color: "rgb(40, 40, 40)"
	},{
		stop: 0.25,
		color: "rgb(52, 81, 113)"
	},{
		stop: 0.50,
		color: "rgb(89, 120, 81)"
	},{
		stop: 0.75,
		color: "rgb(206, 137, 28)"
	},{
		stop: 1.00,
		color: "rgb(120, 48, 44)"
	}
	],
	gradientBox, toneBox);
	toneBox.style.backgroundColor = "RGB(" + eyeColour[0] + "," + eyeColour[1] + "," + eyeColour[2] + ")";
	
	var gradientBox = document.getElementById("eyevaluegradient")
	var toneBox = document.getElementById("eyevaluecolor")
	var eyeValue = new GradientReader([{
		stop: 0.0,
		color: "rgb(19, 14, 8)"
	},{
		stop: 1.00,
		color: "rgb(128, 128, 128)"
	}
	],
	gradientBox, toneBox);
	toneBox.style.backgroundColor = "RGB(" + eyeValue[0] + "," + eyeValue[1] + "," + eyeValue[2] + ")";	
	
	//blend these colours together using Hard Light-ish model
	var irisColour = blendHardLight(eyeColour, eyeValue);
		
	//hair
	gradientBox = document.getElementById("hairvaluegradient")
	toneBox = document.getElementById("hairvaluecolor")
	var hairValue = new GradientReader([{
		stop: 0.0,
		color: "rgb(0, 1, 4)"
	},{
		stop: 0.5,
		color: "rgb(101, 90, 81)"
	},{
		stop: 1.00,
		color: "rgb(229, 229, 242)"
	}
	],
	gradientBox, toneBox);
	toneBox.style.backgroundColor = "RGB(" + hairValue[0] + "," + hairValue[1] + "," + hairValue[2] + ")";
	
	gradientBox = document.getElementById("haircolorgradient")
	toneBox = document.getElementById("haircolorcolor")
	var hairHue = new GradientReader([{
		stop: 0.0,
		color: "rgb(121, 122, 126)"
	},{
		stop: 0.5,
		color: "rgb(119, 81, 0)"
	},{
		stop: 1.00,
		color: "rgb(126, 41, 0)"
	}
	],
	gradientBox, toneBox);
	toneBox.style.backgroundColor = "RGB(" + hairHue[0] + "," + hairHue[1] + "," + hairHue[2] + ")";	
	
	//blend these colours together using Hard Light-ish model
	var hairColour = blendHardLight(hairValue, hairHue);
	*/
	//Roll for albinism
	var rgbAlbino = [251, 209, 209, 255, 251, 209, 209, 255];
	var rollAlbino = parseInt(Math.random()*17000); //estimate from http://www.ncbi.nlm.nih.gov/pmc/articles/PMC2211462/
	if (rollAlbino == 17000) {
		var skinColour = blendHardLight(skinColour, rgbAlbino)
		//var irisColour = blendHardLight(eyeColour, rgbAlbino)
		//var hairColour = blendHardLight(hairColour, rgbAlbino)
	};
	
	var skinRGB = "RGB(" + skinColour[0] + "," + skinColour[1] + "," + skinColour[2] + ")";
	//var eyeRGB = "RGB(" + irisColour[0] + "," + irisColour[1] + "," + irisColour[2] + ")";
	//var hairRGB = "RGB(" + hairColour[0] + "," + hairColour[1] + "," + hairColour[2] + ")";
	
	document.getElementById("finalskintone").style.backgroundColor = skinRGB;
	//document.getElementById("finaleyecolour").style.backgroundColor = eyeRGB;
	//document.getElementById("finalhaircolour").style.backgroundColor = hairRGB;
	
	//return [skinRGB, eyeRGB, hairRGB]
	return[skinRGB]
}

//Draw/////////////////////////////////////////////////////////////////////////
function drawPath(p, parent, objectLabel, svgfill, svgfillopacity, svgstroke, svgstrokewidth) {
    "use strict";
    var xmlns = "http://www.w3.org/2000/svg";
    var drawnPath = document.createElementNS(xmlns, "path");
    drawnPath.setAttribute("id", objectLabel);
    drawnPath.setAttribute("d", p);
    drawnPath.setAttribute("fill", svgfill);
    drawnPath.setAttribute("fill-opacity", svgfillopacity);
	drawnPath.setAttribute("fill-rule", "evenodd");
    drawnPath.setAttribute("stroke", svgstroke);
    drawnPath.setAttribute("stroke-width", svgstrokewidth);
    parent.appendChild(drawnPath);
}

function drawRectangle(w, h, x, y, parent, objectLabel, svgfill, svgfillopacity, svgstroke, svgstrokewidth) {
    "use strict";
    var xmlns = "http://www.w3.org/2000/svg";
    var drawnRectangle = document.createElementNS(xmlns, "rect");
    drawnRectangle.setAttribute("id", objectLabel);
    drawnRectangle.setAttribute("x", x);
    drawnRectangle.setAttribute("y", y);
    drawnRectangle.setAttribute("height", h);
    drawnRectangle.setAttribute("width", w);
    drawnRectangle.setAttribute("fill", svgfill);
    drawnRectangle.setAttribute("fill-opacity", svgfillopacity);
    drawnRectangle.setAttribute("stroke", svgstroke);
    drawnRectangle.setAttribute("stroke-width", svgstrokewidth);
    parent.appendChild(drawnRectangle);
}

function drawCircle(r, cx, cy, parent, objectLabel, svgfill, svgfillopacity, svgstroke, svgstrokewidth) {
	"use strict";
    var xmlns = "http://www.w3.org/2000/svg";
    var drawnCircle = document.createElementNS(xmlns, "circle");
	drawnCircle.setAttribute("cx", cx);
    drawnCircle.setAttribute("cy", cy);
    drawnCircle.setAttribute("r", r);
    drawnCircle.setAttribute("fill", svgfill);
    drawnCircle.setAttribute("fill-opacity", svgfillopacity);
    drawnCircle.setAttribute("stroke", svgstroke);
    drawnCircle.setAttribute("stroke-width", svgstrokewidth);
	parent.appendChild(drawnCircle);
}

function drawHuman(){
	"use strict"
	var x = 0;
    var y = 1;
    var z = 2;
    var xmlns = "http://www.w3.org/2000/svg";
	//Scales
    var svgCanvas = document.getElementById("svgcanvas");
    var svgCanvasHeight = svgCanvas.getAttribute("height");
    var svgCanvasWidth = svgCanvas.getAttribute("width");
    var bodyScale = 0.25;
    //var headScale = 1;
    var bodyOrigin = [svgCanvasWidth / 2, 0];
    //var faceFrontOrigin = [5 * (svgCanvasWidth / 12), 0];
    //var faceSideOrigin = [9 * (svgCanvasWidth / 12), 0];
	//get values
	var myGender = getGender();
	//Generate sizes
	
	
	//makeXYZ(thisPart, parentx, parenty, parentz)
	//var inputBodyHeight = getInputDimensionsXYZ("bodyheight",myGender)
	// ANSUR Stature: from floor to tip of head
	var myHeight = makeXYZ(getInputDimensionsXYZ("height", myGender), 0, 0, 0);
	
	// ANSUR Span: Fingertip to fingertip, while in T-pose
	var myFingerTipspan = makeXYZ(
		getInputDimensionsXYZ("handspan", myGender),
		myHeight[y],
		0,
		0);
		
	//var myBoundingBox = makeXYZ(getInputDimensionsXYZ("boundingbox", myGender), 0, 0, 0)
	var myBoundingBox = [
		myFingerTipspan[x],
		myHeight[y],
		0
	];
		
	
	//Get mid point

	var myHips = makeXYZ(
		getInputDimensionsXYZ("hips",myGender),
		myBoundingBox[x],
		myBoundingBox[y],
		0);
		
	//Get quarters
 	var myAcromion = makeXYZ(
		getInputDimensionsXYZ("acromion", myGender),
		myHips[x],
		myBoundingBox[y] - myHips[y],
		0);
	myAcromion[y] = myAcromion[y] + myHips[y]
		
	var myKnee = makeXYZ(
		getInputDimensionsXYZ("knee", myGender),
		myHips[x],
		myHips[y],
		0);
	
	// Upper quarter
	
	var myChin = makeXYZ(
		getInputDimensionsXYZ("chin", myGender),
		0,
		myBoundingBox[y] - myAcromion[y],
		0);
	myChin[y] = myChin[y] + myAcromion[y]
	
	var myFace = makeXYZ(
		getInputDimensionsXYZ("face", myGender),
		myAcromion[x],
		myBoundingBox[y] - myAcromion[y],
		0);
	myFace[y] = myFace[y] + myAcromion[y]
	
	var myNeck = makeXYZ(
		getInputDimensionsXYZ("neck", myGender),
		myFace[x],
		myFace[y] - myAcromion[y],
		0);
	myNeck[y] = myNeck[y] + myAcromion[y]
	
	// Second quarter
	
	var myWaist = makeXYZ(
		getInputDimensionsXYZ("waist",myGender),
		myHips[x],
		myAcromion[y] - myHips[y],
		0);
	myWaist[y] = myWaist[y] + myHips[y];	
	
	var myAxilla = makeXYZ(
		getInputDimensionsXYZ("axilla", myGender),
		myAcromion[x],
		myAcromion[y] - myWaist[y],
		0);
	myAxilla[y] = myAxilla[y] + myWaist[y]

	var myChest = makeXYZ(
		getInputDimensionsXYZ("chest",myGender),
		0,
		myAxilla[y] - myWaist[y],
		0);
	myChest[x] = myAxilla[x];
	myChest[y] = myChest[y] + myWaist[y];
	
	// Third Quarter

	var myCrotch = makeXYZ(
		getInputDimensionsXYZ("crotch",myGender),
		0,
		myHips[y] - myKnee[y],
		0);
	myCrotch[x] = myHips[x]*0.0;
	myCrotch[y] = myCrotch[y] + myKnee[y];
	
	var myKneeUpper = makeXYZ(
		getInputDimensionsXYZ("kneeupper", myGender),
		myHips[x] - myKnee[x],
		myHips[y] - myKnee[y],
		0);
	myKneeUpper[x] = myKneeUpper[x] + myKnee[x];
	myKneeUpper[y] = myKneeUpper[y] + myKnee[y];
	
	var myThigh = makeXYZ(
		getInputDimensionsXYZ("thigh", myGender),
		myHips[x] - myKnee[x],
		0,
		0);
	myThigh[x] = myThigh[x] + myKnee[x];
	myThigh[y] = myCrotch[y]

	
	//Fourth Quarter
	var myCalf = makeXYZ(
		getInputDimensionsXYZ("calf", myGender),
		myKnee[x],
		myKnee[y],
		0);
		
	var myHeel = makeXYZ(
		getInputDimensionsXYZ("heel", myGender),
		myKnee[x],
		0,
		0);
		
	
	//Arms
	var myBideltoid = makeXYZ (
		getInputDimensionsXYZ("bideltoid", myGender),
		myAcromion[x],
		0,
		0);
	myBideltoid[y] = (myAcromion[y] + myAxilla[y])/2
	
	var myWrists = makeXYZ(
		getInputDimensionsXYZ("wrist", myGender),
		myChest[x],
		myCrotch[y],
		0);
	// Y is currently the distance between shoulder and wrist. We'll fix that,
	// after we've used it to find the elbow.
	
	var myElbows = makeXYZ(
		getInputDimensionsXYZ("elbow", myGender),
		myWrists[x],
		myAcromion[y] - myWrists[y],
		0);

	// We have the lengths of the arm, but not their height from the floor:
	myElbows[y] = myAcromion[y] - myElbows[y]

	
	var myFingerTips = makeXYZ(
		getInputDimensionsXYZ("hand", myGender),
		myWrists[x],
		myElbows[y]-myWrists[y],
		0);

	
	var myKnuckles = makeXYZ(
		getInputDimensionsXYZ("knuckle", myGender),
		0,
		myFingerTips[y],
		0);
	myKnuckles[y] = myWrists[y] - myKnuckles[y];
	
	//If we draw the fingertips straight it's too strained,
	//So we'll make them look angled by shortening them here
	myFingerTips[y] = myWrists[y] - (myFingerTips[y]*0.8);
		
		
	//Detail
	var mySupranastale = makeXYZ(
		getInputDimensionsXYZ("supranastale", myGender),
		0,
		myAcromion[y] - myAxilla[y],
		0);

	mySupranastale[y] = mySupranastale[y] + myAxilla[y]
	

	
	
	//Get Colours=============================================================
	var colours = chooseColours()
	var skinRGB = colours[0]
	//var eyeRGB = colours[1]
	//var hairRGB = colours[2]
	
	
	//Set up groups============================================================
    //delete groups from last run, if they exist.
    var gDrawing = document.getElementById("grpdrawing");
    while (gDrawing.firstChild) {
        gDrawing.removeChild(gDrawing.firstChild);
    }
    //create new groups
    var gBody = document.createElementNS(xmlns, "g");
    gBody.setAttribute("id", "grpbody");
    gBody.setAttribute("transform", "matrix(" + bodyScale + ",0,0," +
            -bodyScale + "," + bodyOrigin[0] + "," + svgCanvasHeight + ")");
    gDrawing.appendChild(gBody);

	/*
    var gFaceFront = document.createElementNS(xmlns, "g");
    gFaceFront.setAttribute("id", "grpfacefront");
    gFaceFront.setAttribute("transform", "matrix(" + headScale + ",0,0," +
            -headScale + "," + faceFrontOrigin[0] + ","
            + (svgCanvasHeight - (myFaceBox[y] / headScale)) + ")");
    gDrawing.appendChild(gFaceFront);

    var gFaceSide = document.createElementNS(xmlns, "g");
    gFaceSide.setAttribute("id", "grpfaceside");
    gFaceSide.setAttribute("transform", "matrix(" + headScale + ",0,0,"
            + -headScale + "," + faceSideOrigin[0] + ","
            + (svgCanvasHeight - (myFaceBox[y] / headScale)) + ")");
    gDrawing.appendChild(gFaceSide);
	*/
	
	//Blockout=================================================================
	//drawRectangle(w, h, x, y, parent, objectLabel, svgfill, svgfillopacity, svgstroke, svgstrokewidth)
	drawRectangle(
		myBoundingBox[x], myBoundingBox[y],
		-myBoundingBox[x]/2, "0",
		gBody, "myBoundingBox",
		"#999999", "0", "#333333", "0");
	document.getElementById("pheight").innerHTML = myBoundingBox[y] + " mm " 
		+ "(" + parseInt(myBoundingBox[y]/304.8) +" feet, " 
		+ parseInt((myBoundingBox[y] - (parseInt(myBoundingBox[y]/304.8)) * 304.8) / 25.4 )
		+ " inches)"
	
		
	//drawings=================================================================

	//NEW Body
	var p = (
		"M " + "0" + " " + myBoundingBox[y]
		+ " L " + myNeck[x]/2 + " " + myBoundingBox[y]
		+ " L " + myFace[x]/2 + " " + myFace[y]
		//+ " L " + myNeck[x]/2 + " " + myChin[y]
		+ " L " + myNeck[x]/2 + " " + myNeck[y]
		+ " L " + myAcromion[x]/2 + " " + myAcromion[y]
		+ " L " + myBideltoid[x]/2 + " " + myBideltoid[y]
		//Arms: Use spacers to prevent overlap with body
		+ " L " + ((myThigh[x])+ myElbows[x]) + " " + myElbows[y]
		+ " L " + (myThigh[x] + (2 * myWrists[x])) + " " + myWrists[y]
		+ " L " + (myThigh[x] + (2 * myWrists[x])) + " " + myKnuckles[y]		
		+ " L " + (myThigh[x] + (myWrists[x])) + " " + myFingerTips[y]
		+ " L " + (myThigh[x] + (myWrists[x]) - myFingerTips[x]) 
			+ " " + myFingerTips[y]			
		+ " L " + (myThigh[x] + myWrists[x]) + " " + myWrists[y]
		+ " L " + myThigh[x] + " " + myElbows[y]
		// End Arms
		+ " L " + myAxilla[x]/2 + " " + myAxilla[y]
		+ " L " + myChest[x]/2 + " " + myChest[y]
		+ " L " + myWaist[x]/2 + " " + myWaist[y]
		+ " L " + myHips[x]/2 + " " + myHips[y]
		+ " L " + myThigh[x] + " " + myThigh[y]
		+ " L " + myKneeUpper[x] + " " + myKneeUpper[y]
		+ " L " + myKnee[x] + " " + myKnee[y]
		+ " L " + myCalf[x] + " " + myCalf[y]
		+ " L " + myHeel[x] + " " + myHeel[y]
		
		// Centre Line
		+ " L " + "0" + " " + "0"
		+ " L " + myCrotch[x]/2 + " " + myCrotch[y]
		+ " L " + -myCrotch[x]/2 + " " + myCrotch[y]
		+ " L " + "0" + " " + "0"
		// End Centre
		
		+ " L " + -myHeel[x] + " " + myHeel[y]
		+ " L " + -myCalf[x] + " " + myCalf[y]
		+ " L " + -myKnee[x] + " " + myKnee[y]
		+ " L " + -myKneeUpper[x] + " " + myKneeUpper[y]
		+ " L " + -myThigh[x] + " " + myThigh[y]
		+ " L " + -myHips[x]/2 + " " + myHips[y]
		+ " L " + -myWaist[x]/2 + " " + myWaist[y]
		+ " L " + -myChest[x]/2 + " " + myChest[y]
		+ " L " + -myAxilla[x]/2 + " " + myAxilla[y]
		// Arms:
		+ " L " + -myThigh[x] + " " + myElbows[y]
		+ " L " + -(myThigh[x] + myWrists[x]) + " " + myWrists[y]
		+ " L " + -(myThigh[x] + (myWrists[x]) - myFingerTips[x]) 
			+ " " + myFingerTips[y]
		+ " L " + -(myThigh[x] + (myWrists[x])) + " " + myFingerTips[y]
		+ " L " + -(myThigh[x] + (2 * myWrists[x])) + " " + myKnuckles[y]	
		+ " L " + -(myThigh[x] + (2 * myWrists[x])) + " " + myWrists[y]
		+ " L " + -((myThigh[x])+ myElbows[x]) + " " + myElbows[y]
		// End Arms.
		
		+ " L " + -myBideltoid[x]/2 + " " + myBideltoid[y]
		+ " L " + -myAcromion[x]/2 + " " + myAcromion[y]
		+ " L " + -myNeck[x]/2 + " " + myNeck[y]
		//+ " L " + -myNeck[x]/2 + " " + myChin[y]		
		+ " L " + -myFace[x]/2 + " " + myFace[y]
		+ " L " + -myNeck[x]/2 + " " + myBoundingBox[y]
		+ " L " + "0" + " " + myBoundingBox[y]
	);
	
	drawPath(p, gBody, "bodypathfront", skinRGB, "1", "#000000", "2");



	//Detail
	
	
	p = (
	
		//Eyes
		" M " + myFace[x]/2 + " " + myFace[y]
		+ " L " + -myFace[x]/2 + " " + myFace[y]
		
		//Face
		+ " M " + "0" + " " + myBoundingBox[y]
		+ " L " + "0" + " " + myChin[y]
		
		//Collarbone
		+ " M " + (myAcromion[x]/2)*0.67 
			+ " " + (((myAcromion[y] - mySupranastale[y])*0.67) + mySupranastale[y])
		+ " L " + (myAcromion[x]/2 * 0.1) + " " + mySupranastale[y]
		+ " M " + -(myAcromion[x]/2 * 0.1) + " " + mySupranastale[y]
		+ " L " + -(myAcromion[x]/2)*0.67 
			+ " " + (((myAcromion[y] - mySupranastale[y])*0.67) + mySupranastale[y])

		//Crotch
		+ " M " + (myHips[x]/2 + myCrotch[x])/4 + " " + (myHips[y] - (myHips[y]-myCrotch[y])/1.5)
		+ " L " + myCrotch[x]/2 + " " + myCrotch[y]
		+ " L " + -myCrotch[x]/2 + " " + myCrotch[y]
		+ " L " + -(myHips[x]/2 + myCrotch[x])/4 + " " + (myHips[y] - (myHips[y]-myCrotch[y])/1.5)
	);

	
	drawPath(p, gBody, "bodydetailfront", skinRGB, "0", "#000000", "2"); 
}




function hideShow(){
	var selectedgender = getGender();
	var parentsection = document.getElementById("options");
	var childforms = parentsection.getElementsByTagName("form");
	var i;
	for (i = 0;i < childforms.length; i++) {
		if (childforms[i].name === selectedgender) {
			childforms[i].style.display="";
		} else {
			childforms[i].style.display="none";
		}
	}
}
