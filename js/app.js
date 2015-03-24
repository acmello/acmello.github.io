$(function() {
	
	// once the DOM is ready, grab the necessary
	// elements to work with
	var $descriptions = $(".description")
	  , $brands       = $('.brand')
	  , $title        = $('.title')
	  , $container    = $('.inner-content')
	  , $line         = $('hr')
	  , $menuItems    = $('.bottom-titles')
	  , $modal        = $('.modal')

	  // styling classes 
	  , INVISIBLE      = "invisible" // for element with display none
	  , ROW_ANIMATION  = 'straigh-line-animated' // for line animation
	  , FADE_IN        = "animated fadeIn"
	  , FADE_OUT	   = "animated fadeOut"
	  , FADE_OUT_RIGHT = "animated fadeOutRight"
	  , FADE_IN_LEFT   = "animated fadeInLeft"
	  , ACTIVE_BRAND   = 'current-active'

      , sectionHandler = {
	  		section: null,

	  		showCurrentSection: function(section) {
	  			return function() {
	  				if(this ===	 window) return;
		  			this.section.removeClass(INVISIBLE)
						.addClass(FADE_IN);	
		  		};
			},

		  	cleanPreviousSection: function() {
                $("#message").text('').removeClass().addClass(INVISIBLE);
		  		$('.inner-content').find('#aboutme, #menu, #form').addClass(INVISIBLE);
		  	}
	  }
    ;

    // configure listeners for the box style
    subscribeAll();

	// trigger the initial animation  
    animationInit();

    function subscribeAll() {
    	
    	/**
    	* perform animation once the user clicks
    	* in one of the brands available 
    	**/

    	$brands.on('click', displayItems);

    	function displayItems(e) {
    		var $target = $(e.target)
    		  , section = $("#" + $target.data().value)
    		  ;

    		e.preventDefault();
    		e.stopPropagation();

    		sectionHandler.cleanPreviousSection();
    		sectionHandler.section = section; 

    		setBrandToActive(e.target);

    		// calls specific function based on the
    		// data attribute

    		rowAnimation(sectionHandler.showCurrentSection());
    	}

    	function setBrandToActive(element) {
    		$brands.hasClass(ACTIVE_BRAND) && $brands.removeClass(ACTIVE_BRAND);
    		$(element).addClass(ACTIVE_BRAND);
    	} 

    	function rowAnimation(fn) {
    		if($line.hasClass(INVISIBLE)) {
	    		$line.removeClass(INVISIBLE);

				setTimeout(function() {
                    $line.addClass(ROW_ANIMATION);
                    fn && fn.call(sectionHandler, null);
                }, 0);

    		} else {
    			$line.removeClass(ROW_ANIMATION);

    			setTimeout(function() {
    				$line.addClass(ROW_ANIMATION);
    				fn && fn.call(sectionHandler, null);
    			}, 500);
    		}
    	}

        $(".form").on('submit', function(e) {
            e.preventDefault();
            var options = {}, mail;
           
            $(this).children().each(function() {
                if(! $(this).is('button')) {
                    options[$(this).attr('name')] = $(this).val(); 
                }
            });

            console.log(options);
        
            mail = new Mail(options);
            mail.sendMessage();
        });
    };

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