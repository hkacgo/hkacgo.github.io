function FirebaseStorageHelper(config) {
    
    var guid = function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    
    firebase.initializeApp(config);
    
    this.uploadFile = function(inputSelecter, child) {
        var file = $($(inputSelecter).prop('files'));
        var result = [];
        
        file.each(function(index, singleFile) {
            var filenameExtension = singleFile.type.split('/').pop();
            var filename = guid() + '.' + filenameExtension;
            // console.log(filename);
            result.push({
                filename: filename,
                file: singleFile
            });
        });
        
        result.forEach(function(data) {
            // console.log(child + '/' + data.filename);
            firebase.storage().ref(child + '/' + data.filename).put(data.file);
        });
    }
    
    this.getFileURL = function(path, callBack) {
        firebase.storage().ref(path).getDownloadURL().then(callBack);
    }
    
    this.deleteFile = function(path, callBack) {
        firebase.storage().ref(path).delete().then(callBack);
    }
    
}