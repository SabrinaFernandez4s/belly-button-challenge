//Building a function called buildMetadata and we're passing the argument "sample" into it
// the argument "sample" is telling the computer, everytime you see the word "sample", run a specific section of the function.
function buildMetadata(sample) {

  //The d3 library below reads the json file, which we are now calling "data"
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

    //Now, we're setting a variable for metadata, where we go inside the json(data) and go specifically to the metadata key
    let metadata = data.metadata;

    // Filter the data for the object with the desired sample number
    // We are setting a variable called resultArray, and it is going in to the metadata variable (data.metadata),
    // filtering it by assigning sampleObj as "x", and for every "x" in the "id" key, we equal it to "sample", so the function
    // can run every time.
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // We are then setting another variable called "result", where we take the resultArray variable (now full of ids),
    // and only taking the first value [0] (which if we check the json file, are also ids), and putting them into an array.
    let result = resultArray[0];


    // Use d3 to select the panel with id of `#sample-metadata`
    let box = d3.select("#sample-metadata");


    // Use `.html("") to clear any existing metadata
    //.html erases old info when selecting an option so it doesnt keep appending.
    // so everytime someone selects a sample number sa dropdown, it deletes the old info previously selected.
    box.html("")

    // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.


    // in English: for every key in result, which is the variable we set equal to the array of ids,
    // we are box appending inside the "h6" tag in the html all the values in that array (.text)
    // you're printing in proper grammatical format that "your key is going to equal to this value".
    for (key in result) {
      box.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
    };
   

  });
}

function buildCharts(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray)
    let result = resultArray[0];


    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Build a bar chart

    let barData = [
      {
        y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }];

    // Bar chart layout (basically the title and the spacing between stuff)

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Build a Bubble Chart

    // Create a bubble chart that displays each sample:
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.

    let bubbleData = [
      {
        y: sample_values,
        x: otu_ids,
        text: otu_labels,
        type: "bubble",
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    // Bubble chart layout
    let bubbleLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

function init() {
  // Grab a reference to the dropdown select element

  // Use the list of sample names to populate the select options
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

    console.log(data)


    names = data.names

    // We know to select #selDataset because, when you open the actual website and inspect the dropdown button where you would want
    // to see your data, it would lead you to the #selDataset id.
    let selector = d3.select("#selDataset");


    d3.select("#selDataset");
    
    // the for loop says: go down the row of all the names in the names key in the json file and....
    for (let i = 0; i < names.length; i++) {
      
      // call the variable selector (which is selecting the #selDataset tag in the html)
      selector

      //within the tag, append everything in the "option" tag in the html, because if you open the website and inspect
      // the actual optiom in the dropdown menu and click the "open" arrow to see more, you would see all the sample names in the tag.
        .append("option")

        // take all the names in the name key from json file and add a list of names
        .text(names[i])

        // the property takes the value within the html tag "option", because it has a "value = [sample name]" inside the tag, and
        // the second argument, which is the .text we put, basically says "return the value of whatever text is in the second argument (user's choice)"
        .property("value", names[i]);
    };

    buildMetadata(names[0])
    buildCharts(names[0])
  });


}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Initialize the dashboard
init();