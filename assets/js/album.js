function search_photos(form){
    var formData = new FormData(form);
    var q = formData.get('query');
    if(q == ""){
        console.log('no input');
    }
    else{
        sdk.searchGet({'q': q}, {}, {})
            .then(response => {
                data = response.data;
                var photos = data.results;
                render_photos(photos);
            });
    }
    return false;
}


function upload_photo(form){
    var formData = new FormData(form);
    var photo = formData.get('fileInput');
    console.log(photo);
    var custom_labels = "";
    custom_labels += formData.get('custom_labels');
    console.log(custom_labels);
    if(!photo.size){
        return false;
    }
    var param = {
        'bucket': 'cs6998-photos',
        'filename': photo.name,
        'Content-Type': 'text/plain',
        'x-amz-meta-customLabels': custom_labels
    };
    console.log(param);
    var reader = new FileReader();
    reader.onloadend = function(){
        var data = reader.result.split(',')[1];
        sdk.uploadBucketFilenamePut(param, data, {}).then(response => {
            console.log("Uploaded!");
        })
    }
    reader.readAsDataURL(photo);
    return false;
}


function render_photos(photos){
    var html = ""
    document.getElementById("display-photo").innerHTML = '';
    if(!photos.length){
        html += '<h2>Sorry, No Such Photos</h2>'
    }
    for(var photo of photos){
        console.log(photo.url);
        html += '<div class="col"><div class="card shadow-sm"><a href="' + photo.url + '" target="_blank"><img class="bd-placeholder-img card-img-top" width="100%" height="225" src="' + photo.url + '"></img></a></div></div>';
    }
    document.getElementById("display-photo").innerHTML += html;
}


let speechRecognition = new webkitSpeechRecognition();
let listening = false;
function text2speech(){
    listening = !listening;
    listening? speechRecognition.start():speechRecognition.stop();
    speechRecognition.onresult = event => {
        listening = false;
        console.log(event);
        for(var result of event.results){
            var text = result[0].transcript;
            console.log(text);
            var search_bar = document.getElementById('search-bar');
            search_bar.value = text;
        }
    };
}
