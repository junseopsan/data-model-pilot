const EventBus = (() => {
    // variable to hold registered events
    let instance;
  
    function createInstance() {
      return {};
    }
  
    return {
      getInstance() {
        if (!instance) {
          instance = createInstance();
        }
        return instance;
      },
      // to register an event
      on(key, cb) {
        this.getInstance();
        // if it didnt exist create entry
        if (instance[key] == null) {
          instance[key] = cb;
        } else {
          // if already array (with multiple callbacks)
          if (instance[key] && Array.isArray(instance[key])) {
            instance[key] = [...instance[key], cb];
          }
          // if already contains value but not an array, turn to array
          if (instance[key] && !Array.isArray(instance[key])) {
            instance[key] = [instance[key], cb];
          }
        }
      },
      // to deregister an event
      off(key) {
        delete instance[key];
      },
      // to emit an event
      emit(key, data) {
        if (instance[key] != null) {
          if (Array.isArray(instance[key])) {
            instance[key].forEach(cb => {
              cb(data);
            });
          }
          if (!Array.isArray(instance[key])) {
            instance[key](data);
          }
        }
      },
      // to clear all registered events
      clear() {
        instance = {};
      }
    };
  })();
  
  export default EventBus;