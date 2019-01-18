    // window.onload=getEXIF;
    (function($) {

    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');
    var list = document.querySelector('.list-group');
    var endList = document.querySelector('.counter');
    var prefix = ("./exif-gps-samples/");

    uploadForm.addEventListener('submit', function(e) {
        var uploadFiles = document.getElementById('js-upload-files').files;
        e.preventDefault();
        startUpload(uploadFiles);                
    });
    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';
        startUpload(e.dataTransfer.files);
    }
    dropZone.ondragover = function() {
        this.className = 'upload-drop-zone drop';
        return false;
    }
    dropZone.ondragleave = function() {
        this.className = 'upload-drop-zone';
        return false;
    }
    var startUpload = function(files) {
        console.log(files)
        addingData([...files]);
    }  
    // map
    var mymap = L.map('mapid').setView([51.505, -0.09], 13);
    const accessToken = 'pk.eyJ1IjoibWVnZmEiLCJhIjoiY2pyMGk3cDVmMG5lbjQybnY1Z2YwNGVmdiJ9.wi8U9xSD1J7JiQLKnomUMw';
        L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`,{
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 10,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);

    function formatBytes(bytes) {
        if(bytes < 1024) return bytes + " Bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(1) + " KB";
        else if(bytes < 1073741824) return alert('Your file is too big!');
    };
    
    function addingData(e){
        e.forEach(function(item){
            const name = item.name;
            const type = item.type.slice(6,10);
            const sizePure = item.size;
            const size = formatBytes(sizePure);

            type !== "jpeg" ? $('.toast').show()
                && $('.toastInnerHTML').html("Your file should be in JPEG format") 
                : $('.toast').hide() 
                    && 

            //------uploding EXIF data
            EXIF.getData(item, function(){
                const long = EXIF.getTag(this, "GPSLongitude");
                const lat = EXIF.getTag(this, "GPSLatitude");
                console.log(lat, long);
                
                long === undefined || lat === undefined 
                    ? errorEXIF()
                    : createPicBox();

                    function errorEXIF(){
                        $('.toast').show();
                        $('.toastInnerHTML').html("Some of files have no EXIF data");
                        const ItemElem = document.createElement('div');
                        list.insertBefore(ItemElem, endList);               
                        ItemElem.classList.add('item', 'border-danger', 'error-item');
                        ItemElem.innerHTML = `
                            <img src="${prefix}${name}" class="mr-3 rounded img_error" alt="${name}">
                            <div class="media-body">${name}</div>
                            <div class="media-body">
                                
                                <p>type:<span class='error-item'>${type}</span></p>
                                <p>size:<span class='error-item'>${size}</span></h5>
                            </div>
                            <div class="media-body">
                                <p>GPS Latitude:<span class='error-item'>undefined</span></h5>
                                <p>GPS Longitude:<span class='error-item'>undefined</span></>
                            </div>
                            
                            <span class="badge alert-danger pull-right">Failed</span>
                            <button type="button" class="btn btn-danger btn-sm remove">Remove Item</button>
                            `;                    
                       
                        $('.remove').click(function(){ 
                            $(this).parent().remove();
                            $('.toast').hide()
                        });
                    }

                    function createPicBox(){
                        const toDecimal = function(number){
                            return (number[0].numerator + number[1].numerator / (60* number[1].denominator) +
                            number[2].numerator / (360* number[2].denominator)).toFixed(7);
                        };
                        var marker = L.marker([toDecimal(long), toDecimal(lat)]).addTo(mymap);
                        function onLocationFound(e) {
                            var radius = e.accuracy / 10;
                            marker.bindPopup("Photo was taken " + radius + " meters from this point").openPopup();
                            
                            var latLngs = [ marker.getLatLng() ];
                            var markerBounds = L.latLngBounds(latLngs);
                            mymap.fitBounds(markerBounds);
                          }
                          mymap.on('locationfound', onLocationFound);
                          mymap.locate({setView: true,  maxZoom: 4});

                        const ItemElem = document.createElement('div');
                        list.insertBefore(ItemElem, endList);               
                        ItemElem.classList.add('item');
                        ItemElem.innerHTML = `
                            <img src="${prefix}${name}" class="mr-3 rounded " alt="${name}">
                            <div class="media-body">${name}</div>
                            <div class="media-body">
                                
                                <p>type:<span>${type}</span></p>
                                <p>size:<span>${size}</span></h5>
                            </div>
                            <div class="media-body">
                                <p>GPS Latitude:<span>${toDecimal(long)}</span></h5>
                                <p>GPS Longitude:<span>${toDecimal(lat)}</span></>
                            </div>
                            
                            <span class="badge alert-success pull-right">Success</span>
                            <button type="button" class="btn btn-danger btn-sm remove">Remove Item</button>
                            `;                    
                       
                        $('.remove').click(function(){ 
                            $(this).parent().remove();
                            mymap.removeLayer(marker);
                        });
                    }                
            });         
        })  
    }
})(jQuery);