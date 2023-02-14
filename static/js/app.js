//set URL variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";



//---------------------------filter so starting ID = the data row
function makeMetaData(selectedID){
  d3.json(url).then((data)=>{

    // --------------------------- use metadata to populate demo data
    let demoData = data.metadata;
    for (let i = 0; i < demoData.length; i++) {
      let demo = demoData[i]
      if ( demo.id == selectedID ) {

        let panel = d3.select(".panel-body");
        panel.html("");
       

        for (const [key, value] of Object.entries(demo)) {
          let text = `${key}: ${value}`;
          panel.append("h6").text(text);
        }
      }
    }
  })
}




// Establish the Promise
// const dataPromise = d3.json(url);
 //----------------------Set up starting ID
// let selectedID = 940;
function init(){
// Get JSON data and log to console
//----------------------------- link IDS to dropdonw

  // // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
  d3.json(url).then((data)=>{
    let PatientIDs = data.names;
    // Loop though options and append to to dropdown
    PatientIDs.forEach((ID)=>{
      dropdownMenu.append("option").attr("value", ID).text(ID);
    })
    let initialID = PatientIDs[0];
    makePlots(initialID);
    makeMetaData(initialID);

  })
 
}

function optionChanged(selectedID) {
  makeMetaData(selectedID);
  makePlots(selectedID);

}



//---------bar chart
function makePlots(selectedID) {
  d3.json(url).then((data)=>{

    d3.select("#bar").append("div").attr("class", "panel");
    d3.select("#bubble").append("div").attr("class", "panel");
    d3.select("#bar").attr("class", "panel-body");
    d3.select("#bubble").attr("class", "panel-body");
    d3.select("#gauge").append("div").attr("class", "panel");
    d3.select("#gauge").attr("class", "panel-body");

    let sampleData = data.samples;
    let otuIds = [];
    let sampleValues = [];
    let otuLabels = [];

    for (let i = 0; i < sampleData.length; i++) {

      let selectedSample = sampleData[i];
      if (selectedSample.id == selectedID ) {
        bubbleOtu = selectedSample.otu_ids
        otuIds = selectedSample.otu_ids.map(id=>`otu ${id}`)
        sampleValues = selectedSample.sample_values
        otuLabels = selectedSample.otu_labels

        // var xnum = sampleValues.slice(0,10).reverse();
        // let y = otuIds.slice(0, 10).reverse();
        //         console.log(xnum);
        // console.log(sampleValues);
        // console.log(otuIds)


      let trace1 = [{
          x: sampleValues.slice(0,10).reverse(),
          y: otuIds.slice(0,10).reverse(),
          text: otuLabels.slice(0,10).reverse(),
          name: "OTU",
          type: "bar",
          orientation: "h"
      }];
     
        
      let layout1 = {
        title: `Top 10 OTUs for ${selectedID}`,
        height: 500,
        width: 500
        };
            
      Plotly.newPlot("bar", trace1, layout1);



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
              height: 500,
              width: 1000
        };
    
          
        Plotly.newPlot("bubble", trace2, layout2);
        console.log({otuIds,name:"otuIds"});
        console.log({sampleValues, name:"sampleValues"});   



        let trace3 =  [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: 5,
            // delta: { reference: 9, increasing: { color: "green" } },
            title: { text: "Belly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+delta",
            gauge: {
              axis: { range: [null, 9] },
              steps: [
                { range: [0,1], color: "cyan" },
                { range: [1,2], color: "blue" },
                { range: [2,3], color: "red" },
                { range: [3,4], color: "royalblue" },
                { range: [4,5], color: "red" },
                { range: [6,7], color: "royalblue" },
                { range: [7,8], color: "red" },
                { range: [8,9], color: "royalblue" }]
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