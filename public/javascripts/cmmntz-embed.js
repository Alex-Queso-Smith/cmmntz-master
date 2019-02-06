var Cmmntz = Cmmntz || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
            // some other initialising
            // find or create a div called cmmntz-dropin
            var cfDropinContainer = this.find_or_create_dropin();

            this.initialize_cookie(cfDropinContainer);
            let self = this;
            setTimeout(function(){
              self.activate(cfDropinContainer)
            }, 300)

        },
        activate : async function(cfDropinContainer) {
          var galleryId = _args['galleryId']
          // var [authorized, packUrl, cssUrl, artId, userId, userFont, userTheme] = this.authorize_and_retrieve_art_info();
          var [authorized, packUrl, jsUrl, cssUrl, artId, userId, userFont, userTheme] = await(this.authorize_and_retrieve_art_info())

          if (authorized) {
            // add needed react js files and system css files to the page
            this.load_externals(packUrl, jsUrl, cssUrl);
            // setup the comment div
            var commentDiv = this.form_comments_container(galleryId, artId, userId, userFont, userTheme, _args['mode']);
            // insert the comment div into the dropin container
            cfDropinContainer.innerHTML = commentDiv;
          };
        },
        initialize_cookie : function(cfDropinContainer) {
          var base_url = this.get_base_url(_args['mode'])
          var current_url = window.location.href
          var url = `${this.get_base_url(_args['mode'])}/init?redir=${encodeURIComponent(current_url)}`
          var iframe = `<iframe src="${url}" style="width:1px; height: 1px;"></iframe>`
          cfDropinContainer.innerHTML = iframe;
        },
        load_externals : function(packUrl, jsUrl, cssUrl) {
          new LukesLazyLoader(packUrl, jsUrl, cssUrl, function() {
            console.log('All files have been loaded');
          });
        },
        authorize_and_retrieve_art_info : function() {
          current_url = window.location.href
          var wi = new FormData();
          wi.append("widget_init[gallery_id]", _args['galleryId'])
          wi.append("widget_init[article_topics]", _args['topics'])
          wi.append("widget_init[article_publish_date]", _args['publishDate'])
          wi.append("widget_init[article_artist_name]", _args['artistName'])
          wi.append("widget_init[article_type]", _args['type'])

          if (_args['urlOverride']) {
            wi.append("widget_init[url]", _args['urlOverride'])
          } else {
            wi.append("widget_init[url]", current_url)
          }


          // beta only
          wi.append("widget_init[email]", _args['email'])
          var widget_settings ;

          var base_url = this.get_base_url(_args['mode'])
          var full_url = base_url+"/api/v1/widget_inits.json"

          return fetch(full_url, {
            method: 'POST',
            credentials: 'include', // cross when separated
            body: wi
          })
          .then(response => {
            if(response.ok){
              return response
            } else {
              let errorMessage = `${response.status} (${response.statusText})`,
              error = new Error(errorMessage)
              throw(error)
            }
         })
          .then(response => response.json())
          .then( body => {
            if (body.errors) {
              // stuff to do when no good
            } else {
              widget_settings = body.widget_init
               return [
                 widget_settings.authorized,
                 widget_settings.packUrl,
                 widget_settings.jsUrl,
                 widget_settings.cssUrl,
                 widget_settings.artId,
                 widget_settings.userId,
                 widget_settings.userFont,
                 widget_settings.userTheme
               ];
            }
          })
          .catch(error => console.error(`Error in fetch: ${error.message}`));
          //
        },
        find_or_create_dropin : function() {
          var cfDropinContainer;
          cfDropinContainer = document.getElementById("cmmntz-dropin");
          if (!cfDropinContainer) {
            cfDropinContainer = this.create_dropin();
          };
          return cfDropinContainer;
        },
        create_dropin : function() {
          document.write("<div id='cmmntz-dropin'></div>");
          var cfDropinContainer = document.getElementById("cmmntz-dropin");
          return cfDropinContainer
        },
        form_comments_container : function(galleryId, artId, userId, userFont, userTheme, mode) {
          var mode_data;
          if (mode) {
            mode_data = ` data-mode='${mode}'`
          }
          var commentDiv = '<div id="cf-comments-app"'+mode_data+' class="cf-widget-app" data-gallery-id="'+galleryId+'" data-art-id="'+artId+'" data-art-type="art" data-user-id="'+userId+'" data-user-font="'+userFont+'" data-user-theme="'+userTheme+'"/>';
          return commentDiv;
        },
        get_base_url : function(mode) {
          if (mode) {
            return mode == "staging" ? "https://classifilter-staging.herokuapp.com" : "http://localhost:3000"
          } else {
            return "https://api.cmmntz.com"
          }
        }
    };
}());

'use strict';

/**
 * Luke's Lazyloader
 * AMD, CommonJS & plain browser support
 * https://github.com/LukasBombach/Lazyloader
 */
(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['LukesLazyLoader'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LukesLazyLoader = factory();
  }

}(this, function () {
  function LukesLazyLoader(files, callback) {

    var args = Array.prototype.slice.call(arguments);
    callback = this._isFunction(args[args.length - 1]) ? args.pop() : this._noop;
    this._callbacks = [];

    this._addCallback(callback);
    this.setFiles(args);

    this._setBrowserCssOnLoadSupport();
    window.setTimeout(this._load.bind(this), 0);

  }
  LukesLazyLoader.load = function (files, callback) {
    return new LukesLazyLoader(files, callback);
  };

  (function () {

    this._TYPE_CSS = 'css';
    this._TYPE_JS = 'js';

    this._CSS_REGEX = /(\.css|\.less)/i;
    this._JS_REGEX = /(\.js|\.es6|\.es|\.jsx)/i;
    this.setFiles = function (files) {
      var len = files.length;
      files = Array.isArray(files) ? files : Array.prototype.slice.call(arguments);
      this._files = [];
      for (var i = 0; i < len; i++) this._files.push({url: files[i], loaded: false});
      return this;
    };
    this.then = function (callback) {
      this._addCallback(callback);
      return this;
    };

    this.thenLoad = function (files, callback) {
      this._addToLoadQueue(new LukesLazyLoader(files, callback));
      return this;
    };

    this._load = function () {
      var len = this._files.length;
      for (var i = 0; i < len; i++) this._loadFile(this._files[i].url)
      return this;
    };

    this._loadFile = function (url) {
      if (this._getFileType(url) === this._TYPE_JS) this._appendScript(url);
      if (this._getFileType(url) === this._TYPE_CSS) this._appendStylesheet(url);
      return this;
    };
    this._appendScript = function (url) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.onload = this._getUrlLoadedMethod(url);
      this._appendToHead(script);
      return this;
    };
    this._appendStylesheet = function (url) {
      var stylesheet = document.createElement("link");
      stylesheet.href = url;
      stylesheet.rel = 'stylesheet';
      stylesheet.type = 'text/css';
      stylesheet.onload = this._getUrlLoadedMethod(url);
      stylesheet.onreadystatechange = this._getOnReadyStateChangeCallback(url);
      this._appendToHead(stylesheet);
      if (!this._cssOnLoadSupport) this._pollStylesheet(stylesheet);
      return this;
    };
    this._appendToHead = function (el) {
      document.getElementsByTagName("head")[0].appendChild(el);
      return this;
    };
    this._getFileType = function (url) {
      if (this._JS_REGEX.test(url)) return this._TYPE_JS;
      if (this._CSS_REGEX.test(url)) return this._TYPE_CSS;
      return null;
    };
    this._getOnReadyStateChangeCallback = function (url) {
      var self = this;
      return function () {
        if (['loaded', 'complete'].indexOf(this.readyState) > -1) self._setLoaded(url);
      };
    };
    this._getUrlLoadedMethod = function (url) {
      return function () {
        this._setLoaded(url)
      }.bind(this);
    };
    this._pollStylesheet = function (stylesheet) {
      try {
        if (stylesheet.cssRules || (stylesheet.rules && stylesheet.rules.length))
          this._setLoaded(stylesheet.getAttribute('href'));
        else
          setTimeout(function () {
            this._pollStylesheet(stylesheet);
          }.bind(this), 200);
      }
      catch (e) {
        setTimeout(function () {
          this._pollStylesheet(stylesheet);
        }.bind(this), 200);
      }
      return this;
    };
    this._setLoaded = function (url) {
      var allFilesHaveBeenLoaded = true;
      for (var key in this._files) {
        if (this._files[key].url === url) this._files[key].loaded = true;
        allFilesHaveBeenLoaded = allFilesHaveBeenLoaded && this._files[key].loaded;
      }
      if (allFilesHaveBeenLoaded) this._invokeCallbacks();
      return this;
    };
    this._isFunction = function (functionToCheck) {
      var getType = {};
      return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };
    this._setBrowserCssOnLoadSupport = function () {
      var link = document.createElement("link");
      link.href = '//foo.css';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.setAttribute('onload', 'return;');
      this._cssOnLoadSupport = typeof link.onload === 'function';
      return this;
    };
    this._addCallback = function (callback) {
      this._callbacks.push(callback);
      return this;
    };
    this._invokeCallbacks = function () {
      var len = this._callbacks.length;
      for (var i = 0; i < len; i++) this._callbacks[i]();
      return this;
    };
    this._noop = function () {
    };

  }).call(LukesLazyLoader.prototype);
  return LukesLazyLoader;
}));
