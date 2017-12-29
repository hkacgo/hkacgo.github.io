var guid = function() {

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

}

function FirebaseHelper(config) {
    
    firebase.initializeApp(config);
    this.storage = new FirebaseStorageHelper();
    this.database = new FirebaseDatabaseHelper();

}

function FirebaseStorageHelper() {
    
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

        return result;
    }
    
    this.getFileURL = function(path, callBack) {
        firebase.storage().ref(path).getDownloadURL().then(callBack);
    }
    
    this.deleteFile = function(path, callBack) {
        firebase.storage().ref(path).delete().then(callBack);
    }
}

function FirebaseDatabaseHelper() {

    this.create = function(table, data, success, error) {
        var tableRef = firebase.database().ref(table);
        tableRef.push(data, function(err) {
            if (error != null) {
                success();
            } else {
                error(err);
            }
        });
    }

    this.read = function(status = 'on', table, callBack) {
        var talbeRef = firebase.database().ref(table);
        switch(status) {
            case 'on':
                talbeRef.on('value', callBack);
                break;
            case 'once':
                talbeRef.once('value', callBack);
                break;
            default:
                throw new Error('ArgumentException!');
                break;
        }
    }

    this.update = function(path, data, success, error) {
        firebase.database().ref(path).set(data).then(success).catch(error);
    }

    this.delete = function(path, success, error) {
        firebase.database().ref(path).remove().then(success).catch(error);
    }
}