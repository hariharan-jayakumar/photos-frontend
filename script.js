var sdk = apigClientFactory.newClient({});

function record(){
    if (!('webkitSpeechRecognition' in window)) {
      upgrade();
    } 
    else{
      window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new window.SpeechRecognition();

      recognition.onresult = (event) => {
          const transcribedText = event.results[0][0].transcript;
          document.getElementById('search_box').value = transcribedText;
          searchPhotos();
          }

      recognition.stop();
      recognition.start();
    }
}

function searchPhotos(){
    search_text = document.getElementById('search_box').value;
    sdk.searchGet({'query':search_text}, {}, {}).then((response) => {
        console.log(response);
        console.log(response.data);
        var images = response.data.results;

        var images_div = document.getElementById('search_result');
        while (images_div.firstChild){
            images_div.removeChild(images_div.firstChild);
        }
        if(images.length == 0){
            
            var text = document.createElement('h3');
            text.textContent = 'No images!!';
            console.log('here!');
            document.getElementById('search_result').appendChild(text);
        }
        else{
            for(var image in images){
                var image_element = document.createElement('img');
                image_element.src = images[image].url;
                image_element.width = '250';
                image_element.height = '250';
                image_element.className = 'thumbnail';
                
                document.getElementById('search_result').appendChild(image_element);
            }
        }

    });
    
}

function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      // reader.onload = () => resolve(reader.result)
      reader.onload = () => {
        let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  }

function uploadPhotos(){
  var file = document.getElementById('img').files[0];
  var labels = document.getElementById('labels').value;
  const reader = new FileReader();

  var file_data;
  var encoded_image = getBase64(file).then(
    data => {
    var body = data;
    var params = {"objectKey" : file.name, "bucket" : "photos-bucket-assignment2", "labels":labels, "Content-Type" : "application/json", "realcontenttype": file.type};
    var additionalParams = {};

    sdk.uploadPut(params, body , additionalParams).then(function(res){
      window.alert(file.name + " uploaded");
      document.getElementById('labels').value = ""
      document.getElementById('img').value = ""
    })
  });
}


