
const DOCNAME: string = "ahoge_editor";
const IDNAME: string = "id";

//const db = await connect(DBNAME, VERSION);
function connect(dbname: string, version: number) {
  const dbp = new Promise((resolve, reject) => {
    const req = window.indexedDB.open(dbname, version);
    req.onsuccess = (ev: any) => resolve(ev.target.result);
    req.onerror = ev => reject('fails to open db');
    req.onupgradeneeded = (ev: any) => schemeDef(ev.target.result);
  });
  dbp.then((d: any) => d.onerror = (ev: any) => alert("error: " + ev.target.errorCode));
  return dbp;
}

function schemeDef(db: any) {
  db.createObjectStore(DOCNAME, { keyPath: IDNAME });
}


//const obj = {id: "test" val: 20 };
//const saved = await put(db, obj); // -> { id: 1, val: 20 } 
async function put (db: any, obj: any) { // returns obj in IDB
  return new Promise((resolve, reject) => {
    const docs = db.transaction([DOCNAME], 'readwrite').objectStore(DOCNAME);
    const req = docs.put(obj);
    req.onsuccess = () => resolve({ [IDNAME]: req.result, ...obj });
    req.onerror = reject;
  });
}

//const obj = await get(db, 1) // -> { id: 1, val: 20 }
async function get (db: any, id: string) { // NOTE: if not found, resolves with undefined.
  return new Promise((resolve, reject) => {
    const docs = db.transaction([DOCNAME, ]).objectStore(DOCNAME);
    const req = docs.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = reject;
  });
}