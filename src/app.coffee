d3.csv 'data/major_projects.csv', (data)->
  console.log "Got data",data
  # ---
  container = d3.select('#viz-container')

  container.text "awesome viz here"
