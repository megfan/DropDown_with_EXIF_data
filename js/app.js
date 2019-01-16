    // window.onload=getEXIF;
    (function($) {

    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');
    var clearBtn = document.getElementById('deleteItem');

    var list = document.querySelector('.list-group');
    var listItem = document.querySelector('.item');
    var endList = document.querySelector('.counter');
    var itemData = [];    

    var prefix = ("./exif-gps-samples/");
    var startUpload = function(files) {
        console.log(files)
    }
    function formatBytes(bytes) {
        if(bytes < 1024) return bytes + " Bytes";
        else if(bytes < 1048576) return(bytes / 1024).toFixed(1) + " KB";
        else if(bytes < 1073741824) return alert('Your file is too big!')
    };
    function addingData(e){
        e.forEach(function(item){
            const name = item.name;
            const type = item.type.slice(6,10);
            const sizePure = item.size;
            const size = formatBytes(sizePure);

            //------uploding EXIF data
            EXIF.getData(item, function(){
                const long = EXIF.getTag(this, "GPSLongitude");
                const lat = EXIF.getTag(this, "GPSLatitude");
                const toDecimal = function(number){
                    return (number[0].numerator + number[1].numerator / (60* number[1].denominator) +
                    number[2].numerator / (360* number[2].denominator)).toFixed(7);
                };

                const ItemElem = document.createElement('div');
                list.insertBefore(ItemElem, endList);

                ItemElem.classList.add('item');
                ItemElem.innerHTML = `
                    <img src="${prefix}${name}" class="mr-3" alt="${name}">
                    <div class="media-body">
                        <h4>${name}</h4>
                        <h5 class="mt-0 mb-1">type:<span>${type}</span></h5>
                        <h5 class="mt-0 mb-1">size:<span>${sizePure}</span></h5>
                        <h5 class="mt-0 mb-1">size:<span>${size}</span></h5>
                        <h5 class="mt-0 mb-1">GPS Latitude:<span>${toDecimal(long)}</span></h5>
                        <h5 class="mt-0 mb-1">GPS Longitude:<span>${toDecimal(lat)}</span></h5>
                    </div> 
                    <span class="badge alert-success pull-right">Success</span>
                    <button type="button" class="btn btn-danger btn-sm remove">Remove Item</button>
                    `;                    
                $('.remove').click(function(){ 
                    $(this).parent().remove();
                });
            });         
        })  
    }
    function move() {
        var elem = document.querySelector('.progress-bar');
        elem.style.width = 0 + '%';
        var width = 1;
        var id = setInterval(frame, 40);
        function frame() {
          if (width >= 120) {
            clearInterval(id);
          } else {
            width++;
            elem.style.width = width + '%';
          }
        }
        console.log('finish');
      } ;
    uploadForm.addEventListener('submit', function(e) {
        
        move();
        var uploadFiles = document.getElementById('js-upload-files').files;
        e.preventDefault();
        startUpload(uploadFiles);
        addingData([...uploadFiles]);  
          
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

})(jQuery);