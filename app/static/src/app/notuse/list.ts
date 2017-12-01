import * as d3 from 'd3';
import * as G from '../../globals';

export class NobelList{

    updateList(data): void {
        var rows, cells;
        // Sort the winners' data by year
        var data = data.sort(function(a, b) {
            return +b.year - +a.year;
        });
        // Bind our winners' data to the table rows
        rows = d3.select('#nobel-list tbody')
            .selectAll('tr')
            .data(data);

        rows.enter().append('tr')
            .on('click', (d)=> {
                console.log('You clicked a row ' + JSON.stringify(d));
                this.displayWinner(d);
            });
        // Fade out excess rows over 2 seconds
        rows.exit()
            .transition().duration(G.nbviz.TRANS_DURATION)
            .style('opacity', 0)
            .remove();

        cells = rows.selectAll('td')
            .data(function(d) {
                return [d.year, d.category, d.name];
            });
        // Append data cells, then set their text
        cells.enter().append('td');
        cells.text(function(d) {
                return d;
            });

        // Display a random winner if data is available
        if(data.length){
            this.displayWinner(data[Math.floor(Math.random() * data.length)]);
        }
    }

    displayWinner(_wData): void {

        this.getDataFromAPI('winners/' + _wData._id, (error, wData)=> {

            var nw = d3.select('#nobel-winner');

            nw.select('#winner-title').text(wData.name);
            nw.style('border-color', G.nbviz.categoryFill(wData.category));
            nw.selectAll('.property span')
                .text(function(d) {
                    var property = d3.select(this).attr('name');
                    return wData[property];
                });

            nw.select('#biobox').html(wData.mini_bio);
            // Add an image if available, otherwise remove the old one
            if(wData.bio_image){
                nw.select('#picbox img')
                    .attr('src', 'static/images/winners/' + wData.bio_image)
                    .style('display', 'inline');
            }
            else{
                nw.select('#picbox img').style('display', 'none');
            }

            nw.select('#readmore a').attr('href', 'http://en.wikipedia.org/wiki/' + wData.name);
        });
    };

      // Calling $EVE.API
    getDataFromAPI(resource, callback) {
      console.log('getDataFromAPI:', G.env.$EVE_API + resource);
      d3.json(G.env.$EVE_API + resource, function (error, data: any) {
        if (error) {
          console.log('error');
          return callback(error);
        }

        if ('_items' in data) {
          callback(null, data._items);
        } else {
          callback(null, data);
        }
      });
    }
}
