
export const STORE_NAME: string = "ahoge_editor";
export const ID_NAME: string = "id";

//const db = await connect(DBNAME, VERSION);
export function connect(dbname: string, version: number, storeName: string, keyName: string) {
  const dbp = new Promise((resolve, reject) => {
    const req = window.indexedDB.open(dbname, version);
    req.onsuccess = (ev: any) => resolve(ev.target.result);
    req.onerror = ev => reject('fails to open db');
    req.onupgradeneeded = (ev: any) => schemeDef(ev.target.result, storeName, keyName);
  });
  dbp.then((d: any) => d.onerror = (ev: any) => alert("error: " + ev.target.errorCode));
  return dbp;
}

function schemeDef(db: any, storeName: string, keyName: string) {
  db.createObjectStore(storeName, { keyPath:  keyName});
}


//const obj = {id: "test" val: 20 };
//const saved = await put(db, obj); // -> { id: "test", val: 20 } 
export async function put (db: any,storeName: string , obj: {id: string, value: string}) { // returns obj in IDB
  return new Promise((resolve, reject) => {
    const docs = db.transaction(storeName, 'readwrite').objectStore(storeName);
    const req = docs.put(obj);
    req.onsuccess = () => resolve(obj);
    req.onerror = reject;
  });
}

//const obj = await get(db, 1) // -> { id: 1, val: 20 }
export async function get (db: any, storeName: string, id: string): Promise<{id: string, value: string}> { // NOTE: if not found, resolves with undefined.
  return new Promise((resolve, reject) => {
    const docs = db.transaction(storeName).objectStore(storeName);
    const req = docs.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
}