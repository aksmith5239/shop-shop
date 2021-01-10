export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    //open connection
    const request = window.indexedDB.open('shop-shop', 1);
    let db, tx, store;
    //if version has changed
    request.onupgradeneeded = function(e){
      const db = request.result;
      db.createObjectStore('products', {keyPath: '_id'});
      db.createObjectStore('categories', {keyPath: '_id'});
      db.createObjectStore('cart', {keyPath: '_id'});
    };
    //handle errors
    request.onerror = function(e) {
      console.log('There was an error');
    };
    request.onsuccess = function(e) {
      //save a reference to of database to db variable
      db = request.result;
      //open a transaction to whatever is passed into storeName
      tx = db.transaction(storeName, 'readwrite');
      //save reference to object store
      store = tx.objectStore(storeName);

      //alert error
      db.onerror = function(e){
        console.log('error', e);
      };
      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }
      //close connection after transaction completed
      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}