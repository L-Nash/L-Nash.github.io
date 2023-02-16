//set URL variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



//import data
function makeMetaData(selectedID){
  d3.json(url).then((data)=>{

    // If ID in data matches the selected ID
    let demoData = data.metadata;
    for (let i = 0; i < demoData.length; i++) {
      let demo = demoData[i]
      if ( demo.id == selectedID ) {

        //clear the last entry
        let panel = d3.select(".panel-body");
        panel.html("");
       
        //append the new keys and values to the Demographic Info section 
        for (const [key, value] of Object.entries(demo)) {
          let text = `${key}: ${value}`;
          panel.append("h6").text(text);
        }
      }
    }
  })
}


//Create a function to make plots and populate demo data when new ID is selected
function init(){
  // // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
  d3.json(url).then((data)=>{
    let PatientIDs = data.names;
    // Loop though each name/ID and append to to dropdown
    PatientIDs.forEach((ID)=>{
      dropdownMenu.append("option").attr("value", ID).text(ID);
    })
    //Automatically start with fist ID in list
    let initialID = PatientIDs[0];
    makePlots(initialID);
    makeMetaData(initialID);

  })
 
}
// When the selection changes, run the make metadata and make plots functions
function optionChanged(selectedID) {
  makeMetaData(selectedID);
  makePlots(selectedID);

}



//function to make plots
function makePlots(selectedID) {
  d3.json(url).then((data)=>{
    //creating a space for the charts to go
    d3.select("#bar").append("div").attr("class", "panel");
    d3.select("#bubble").append("div").attr("class", "panel");
    d3.select("#bar").attr("class", "panel-body");
    d3.select("#bubble").attr("class", "panel-body");
    d3.select("#gauge").append("div").attr("class", "panel");
    d3.select("#gauge").attr("class", "panel-body");

    //Lists to house data from for loop
    let sampleData = data.samples;
    let otuIds = [];
    let sampleValues = [];
    let otuLabels = [];

    for (let i = 0; i < sampleData.length; i++) {

      let selectedSample = sampleData[i];
      //If ID selection is equal to ID in sample data
      if (selectedSample.id == selectedID ) {
        //populate data for that ID into lists above
        bubbleOtu = selectedSample.otu_ids
        otuIds = selectedSample.otu_ids.map(id=>`otu ${id}`)
        sampleValues = selectedSample.sample_values
        otuLabels = selectedSample.otu_labels
      //Bar Chart
      let trace1 = [{
          x: sampleValues.slice(0,10).reverse(),
          y: otuIds.slice(0,10).reverse(),
          text: otuLabels.slice(0,10).reverse(),
          name: "OTU",
          type: "bar",
          orientation: "h",
          marker: {color: "goldenrod"}
      }];
     
        
      let layout1 = {
        title: `Top 10 OTUs for ${selectedID}`,
        height: 500,
        width: 500
        };
            
      Plotly.newPlot("bar", trace1, layout1);

        //bubble chart
        let trace2 = [{
          y: sampleValues,
          x: bubbleOtu,
          z: otuLabels,
          type: 'scatter',
          mode: 'markers',
          marker: {size: sampleValues, 
            color: bubbleOtu, 
            colorscale: 'Electric'
          }
        }];
         
        let layout2 = {
              showlegend: false,
              height:800,
              width: 1000
        };
    
          
        Plotly.newPlot("bubble", trace2, layout2);
        console.log({otuIds,name:"otuIds"});
        console.log({sampleValues, name:"sampleValues"});   


        //Gauge
        let trace3 =  [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: 5,
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
              bar: {'color': "darkgrey"},
              axis: { range: [null, ] },
              steps: [
                { range: [0,1], color: "darkviolet" },
                { range: [1,2], color: "darkviolet" },
                { range: [2,3], color: "mediumorchid" },
                { range: [3,4], color: "mediumorchid" },
                { range: [4,5], color: "mediumvioletred"},
                { range: [5,6], color: "mediumvioletred"},
                { range: [6,7], color: "palevioletred"},
                { range: [7,8], color: "palevioletred"}]
             }
            }
          ];
        
        var layout = { 
          width: 400, 
          height: 400, 
          margin: { t: 2, b: 2, l:2, r:2
          } 
        };

        Plotly.newPlot('gauge', trace3, layout);
      }
    };
   })
  }


init();