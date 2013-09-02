/**
 * Created with JetBrains WebStorm.
 * User: zhao
 * Date: 13-8-27
 * Time: 10:01
 * To change this template use File | Settings | File Templates.
 */
function only_once(fn) {
    var called = false;
    return function() {
        if (called) return;
        called = true;
        fn.apply(null, arguments);
    }
}

function _setImmediate(fn){
    if (typeof setImmediate !== 'undefined') {
        setImmediate(fn);
    }
    else {
        setTimeout(fn, 0);
    }
}


function callfunc_timeout(fn, callback, timeout){
    if(isNaN(timeout)){
        fn(callback);
    }
    else{
        var ID = setTimeout(function(){
            callback();
        }, timeout);
        fn(function(){
            clearTimeout(ID);
            callback();
        });
    }
}

var ReadWriteLock = function () {
    this.workers = 0;
    this.wLock = false;
    this.tasks = [];
}

ReadWriteLock.prototype._push = function(tasks, isReadLock, timeout){
    var self = this;
    if(tasks.constructor !== Array) {
        tasks = [tasks];
    }
    tasks.forEach(function(task) {
        var item = {
            fn: task,
            isReadLock: isReadLock,
            timeout: timeout
        };
        self.tasks.push(item);

        function process() {
            if (!self.wLock && self.workers >= 0 && self.tasks.length) {
                var task = self.tasks[0];
                if (task.isReadLock) {
                    self.workers += 1;
                    _setImmediate(process);
                    var next = function () {
                        self.workers -= 1;
                        if (self.wLock && self.workers === 0) {
                            self.wLock = false;
                            process();
                        }
                    };
                    self.tasks.shift();
                    callfunc_timeout(task.fn, only_once(next), task.timeout);
                }
                else{
                    self.wLock = true;
                    var next = function () {
                        self.wLock = false;
                        process();
                    };
                    if(self.workers === 0){
                        self.tasks.shift();
                        callfunc_timeout(task.fn, only_once(next), task.timeout);
                    }
                }
            }
        }

        _setImmediate(process);
    });
}




ReadWriteLock.prototype.readLock = function(tasks, timeout){
    this._push(tasks, true, timeout);
}

ReadWriteLock.prototype.writeLock = function(tasks, timeout){
    this._push(tasks, false, timeout);
}

module.exports = ReadWriteLock;
