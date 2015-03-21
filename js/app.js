$(function() {
	
	// once the DOM is ready, grab the necessary
	// elements to work with
	var $descriptions = $(".description")
	  , $brands       = $('.brand')
	  , $title        = $('.title')
	  , $container    = $('.inner-content')
	  , $line         = $('hr')
	  , $menuItems    = $('.bottom-titles')

	  // styling classes 
	  , INVISIBLE     = "invisible" // for element with display none
	  , LINE_ANIM     = 'straigh-line-animated' // for line animation
	  , ANIM_PLUGIN   = "animated fadeIn"
	  , ACTIVE_BRAND  = 'current-active'

	  // map to callbacks
	  , mapToCallbacks = {
	  		"form": showFormSection,
	  		"position": showPositionSection,
	  		"name": showNameSection,
	  		"project": showProjectSection
	  	}   
	  ;

    // configure listeners for the box style
    subscribeAll();

	// trigger the initial animation  
    animationInit();

    function subscribeAll() {
    	$brands.on('click', displayItems);

    	/**
    	* perform animation once the user clicks
    	* in one of the brands available 
    	**/

    	function displayItems(e) {
    		var $target = $(e.target);

    		e.preventDefault();
    		e.stopPropagation();

    		setBrandToActive(e.target);

    		// calls specific function based on the
    		// data attribute
    		rowAnimation(mapToCallbacks[$target.data().value]);
    	}

    	function setBrandToActive(element) {
    		$brands.hasClass(ACTIVE_BRAND) && $brands.removeClass(ACTIVE_BRAND);
    		$(element).addClass(ACTIVE_BRAND);
    	} 

    	function rowAnimation(fn) {
    		if($line.hasClass(INVISIBLE)) {
	    		$line.removeClass(INVISIBLE)
	    			.addClass(LINE_ANIM);

				fn && fn();	

    		} else {
    			$line.removeClass(LINE_ANIM);

    			setTimeout(function() {
    				$line.addClass(LINE_ANIM);
    				fn && fn();	
    			}, 500);
    		}

    		
    	}
    };

	/**
	* starts the initial animation once the user
	* lands on the page
	**/

	function animationInit() {
		$title.addClass(ANIM_PLUGIN)
		
		$descriptions
			.removeClass(INVISIBLE)
				.addClass(ANIM_PLUGIN);
		
		$brands
			.removeClass(INVISIBLE)
				.addClass(ANIM_PLUGIN);
	};

	// functions for loading specifics
	// section contents
	function showFormSection() {
		$("#form")
			.removeClass(INVISIBLE)
				.addClass(ANIM_PLUGIN);
    };

    function showPositionSection() {

    };

    function showNameSection() {

    };

    function showProjectSection() {

    };

});