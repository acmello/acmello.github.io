$(function() {

    Pace.options = {
        ajax: false, // disabled
        document: false, // disabled
        eventLag: false, // disabled
        restartOnRequestAfter: false
    }

	// the only available element when DOM initializes
    // will be the container
	var $container    = $('.inner-content')
	 
	  // styling animation classes 
	  , INVISIBLE      = "invisible" // for element with display none
	  , ROW_ANIMATION  = "straigh-line-animated" // for line animation
	  , FADE_IN        = "animated fadeIn"
	  , FADE_OUT	   = "animated fadeOut"
	  , FADE_OUT_RIGHT = "animated fadeOutRight"
	  , FADE_IN_LEFT   = "animated fadeInLeft"
	  , ACTIVE_BRAND   = "current-active"
      , SHAKE          = "animated shake"

      , delay = function(fn) {
            setTimeout(fn, 500);
        }

      , section = {
	  		currentSection: null,

            subscribeEvents: function() {
                this.currentSection.off().on('click', 'a', function(e) {
                    var type = $(this).data('type');
                    loader[type](e);
                });
            },

	  		showCurrentSection: function(section) {
	  			return function() {
	  				if(this ===	 window) return;
		  			this.currentSection.removeClass(INVISIBLE)
						.addClass(FADE_IN);	

                    this.subscribeEvents();
		  		};
			},

		  	clearPreviousSection: function() {
                $("#message").text('').removeClass().addClass(INVISIBLE);
		  		$('.inner-content').find('#aboutme, #menu, #form').addClass(INVISIBLE);
		  	}
	    }
      , loader = {
            music: function() {
                var callback = function() {
                     ajax('views/music.html', function() {
                        slidr.create('slidr-div', {
                          breadcrumbs: true,
                          controls: 'border',
                          direction: 'horizontal',
                          fade: true,
                          keyboard: true,
                          overflow: false,
                          theme: '#222',
                          timing: { 'linear': '0.5s ease-in' },
                          touch: true,
                          transition: 'linear'
                        }).start();

                        $('.closeBtn').on("click", function(e) {
                             $container.addClass('animated zoomOut');
                             delay(loader['index']);
                        });
                    })
                 };

                $container.addClass('animated zoomOut');
                delay(callback.bind(this));
            },
            code: function() {
                var callback = function() {
                    ajax('views/code.html', function() {
                        $.ajax({
                            url: 'https://api.github.com/search/repositories?q=user:acmello&sort:updated',
                            cache: false
                            }).done(function(data) {
                                var items = data.items
                                  , i = null
                                  , words = {}
                                  , html = ''
                                  ;

                                for(i in items) {
                                    var item = items[i];
                                    words = {
                                        fullname: item.full_name,    
                                        url: item.html_url,
                                        description: item.description
                                    };
                                    
                                    html += template(words);
                                }

                            if(html) $('.list-projects').html(html);
                        });

                        $('.closeBtn').on("click", function(e) {
                            $container.addClass('animated zoomOut');
                            delay(loader['index']);
                        });
                    });
                };

                $container.addClass('animated zoomOut');
                delay(callback.bind(this));
            },
            people: function(e) {
                // since theres nothing goin here still
                // just add this animation
                $(e.target).addClass(SHAKE);
                setTimeout(function() {
                    $(e.target).removeClass(SHAKE);
                    var tooltip = new Opentip("#people", "Sorry, there's nothing here by now! :(");
                    tooltip.show();        
                }, 600);
            },

            index: function() {
                ajax('views/index.html', function() {
                    $container.off().on('click', '.brand', function(e) {
                        var $target = $(e.target)
                          , sectionEl = $("#" + $target.data().value)
                          ;

                        e.preventDefault();
                        e.stopPropagation();

                        // clean the previous section and set the 
                        // current section
                        section.clearPreviousSection();
                        section.currentSection = sectionEl;     
                        
                        // coloring the active brand 
                        brand.setBrandActive(e.target);

                        // animating row on the top of menu
                        row.animate(section.showCurrentSection());
                    });
                });
            }
        }  
      , brand = {
            // list of jquery elements available with that class
            brands: null,

            // the current active brand 
            currentBrand: null, 

            load: function() {
                return $('.brand'); 
            },

            setBrandActive: function(brand) {
                this.brands = this.load(); 
                this.currentBrand = $(brand);

                this.brands.hasClass(ACTIVE_BRAND) && this.brands.removeClass(ACTIVE_BRAND);
                this.currentBrand.addClass(ACTIVE_BRAND);

                if(this.currentBrand.data('value') === "form") {
                     $('.form').on('submit', function(e) {
                        e.preventDefault();
                        var options = {}, mail;
                       
                        $(this).children().each(function() {
                            if(! $(this).is('button')) {
                                options[$(this).attr('name')] = $(this).val(); 
                            }
                        });

                        mail = new Mail(options);
                        mail.sendMessage();
                    }); 
                }
            }
        }
      , row = {
            row: null,

            load: function() {
                return $('hr');
            },

            animate: function(fn) {
                var syncRowWithSection = function() {
                    this.row.addClass(ROW_ANIMATION);
                    fn && fn.call(section, null);
                }; 

                this.row = this.load();

                if(this.row.hasClass(INVISIBLE)) {
                    this.row.removeClass(INVISIBLE);
                    setTimeout(syncRowWithSection.bind(this), 0);

                } else {
                    this.row.removeClass(ROW_ANIMATION);
                    setTimeout(syncRowWithSection.bind(this), 500);
                }
            }
        }
    ;    

    // loading the first section
    loader['index']();

    /* helpers */

    function ajax(url, callback) {
        $.ajax({
            url: url,
            context: document.body
        }).done(function(data) {
            $(".inner-content").children().remove();
            $(".spinner").addClass('invisible');
            $(".inner-content").html(data).removeClass('zoomOut').addClass(FADE_IN);

            callback && callback();
        });
    }

    function template(words) {
        var template = "<div class='project'><h2><a href='{{url}}'>{{fullname}}</a></h2><p>{{description}}</p></div>"
          , keys = Object.keys(words)
          , length = keys.length
          , html = []
          , cloneTemplate = template
          , key = null
          , value = null
          ;
        
        for(var j = 0; j < length; j++) {
            key = new RegExp("{{" + keys[j] + "}}",'g');
            value = words[keys[j]] == "" ? "No description available" : words[keys[j]];
            cloneTemplate = cloneTemplate.replace(key, value);
        }
        html.push(cloneTemplate);
    
        return html.join("");
    }

	/**
	* starts the initial animation once the user
	* lands on the page
	**/

	function animationInit() {
		$title.addClass(FADE_IN)
		
		$descriptions
			.removeClass(INVISIBLE)
				.addClass(FADE_IN);
		
		$brands
			.removeClass(INVISIBLE)
				.addClass(FADE_IN);
	};

});