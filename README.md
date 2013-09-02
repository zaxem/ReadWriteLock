ReadWriteLock
=============

A read/write lock for node. Read/Write Locks are used to allow many actors to read from a resource, as long as nothing is writing to it. That also means that only one actor may be writing at any given time.

Install the ReadWriteLock module from 'npm install readwritelock', then accessing the ReadWriteLock module by:
```javascript
var ReadWriteLock = require('ReadWriteLock');
```

Creating a ReadWriteLock Lock:
```javascript
var rwlock = new ReadWriteLock();
```

**readLock(functions, [optional]timeout)**
__Arguments__

* functions - An function or a function array which have a callback as argument. 
  These functions will begin to excute in parallel when the read lock is acquired.
  When the callback is called, it will release the read lock.
* timeout(millisecond) - An optional argument which specify the timeout of the lock. 
  If a timeout is specified, The function will release the read lock when the timeout 
  reached, regardless of whether the callback is called. 
  

__Example__

```javascript
rwlock.readLock(function(cb){
    console.log('Start read something!');
    // do stuff
	console.log('The reading procedure is finished!');
    cb();
});

rwlock.readLock([
    function(cb){
        console.log('Start read 1!');
        // do stuff
	    console.log('The reading procedure 1 is finished!');
        cb();
    },
    function(cb){
        console.log('Start read 2!');
        // do stuff
	    console.log('The reading procedure 2 is finished!');
        cb();
    }
], 10000);
```

**writeLock(functions, [optional]timeout)**
__Arguments__

* functions - An function or a function array which have a callback as argument. 
  Because the write lock are mutually exclusive, only one write lock function can 
  be called at the same time. These functions will begin to excute in parallel 
  when the write lock is acquired. When the callback is called, it will release 
  the write lock.
* timeout(millisecond) - An optional argument which specify the timeout of the lock. 
  If a timeout is specified, The function will release the write lock when the timeout 
  reached, regardless of whether the callback is called. 
  

__Example__

```javascript
rwlock.writeLock(function(cb){
    console.log('Start write something!');
    // do stuff
	console.log('The writing procedure is finished!');
    cb();
});

rwlock.writeLock([
    function(cb){
        console.log('Start write 1!');
        // do stuff
	    console.log('The writing procedure 1 is finished!');
        cb();
    },
    function(cb){
        console.log('Start write 2!');
        // do stuff
	    console.log('The writing procedure 2 is finished!');
        cb();
    }
], 10000);
```

For example,
```javascript
var rwlock = new ReadWriteLock();

rwlock.readLock([
    function(cb){
        console.log('Start read 1!');
        setTimeout(function(){
            console.log('The reading procedure 1 is finished!');
            cb();
        },200);
    },
    function(cb){
        console.log('Start read 2!');
        setTimeout(function(){
            console.log('The reading procedure 2 is finished!');
            cb();
        },100);
    }
]);


rwlock.writeLock(function(cb){
    console.log('Start write 1!');
    setTimeout(function(){
        console.log('The writing procedure 1 is finished!');
        cb();
    },100);
});

rwlock.readLock(function(cb){
    console.log('Start read 3!');
    setTimeout(function(){
        console.log('The reading procedure 3 is finished!');
        cb();
    },100);
});
```
The result will be

```javascript
Start read 1!
Start read 2!
The reading procedure 2 is finished!
The reading procedure 1 is finished!
Start write 1!
The writing procedure 1 is finished!
Start read 3!
The reading procedure 3 is finished!
```


