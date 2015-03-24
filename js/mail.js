(function(global) {
	function Mail(options) {
		this.defaults = {
			key: "Qjwsf-BV1IGojROcewpEHA"
		};

		this._options = $.extend(this.defaults, options);
		this.init(options);
	};

	Mail.prototype = {
		init: function() {
			this.validate();
		},

		validate: function() {
			var result = true;
			for(option in this._options) {
				if(this._options.hasOwnProperty(option)
					&& this._options[option] === "") {
					
					throw new Error(this._options[option].concat(' has no value')); 
				}
			}

			return result;
		},

		sendMessage: function() {
			var data = this.buildMessage();
			$("#form").removeClass("fadeOut").addClass("fadeOut");
			
			$.post("http://mandrillapp.com/api/1.0/messages/send.json", data).done(function(response) {
				/*if(response.reject_reason === null
					&& response.status === "sent") {*/

				$('#name').val("");
				$('#description').val("");
				$(".spinner").removeClass('invisible');
				

				setTimeout(function() {
					$(".spinner").addClass('invisible');
					$("#form").addClass("invisible");
					$("#message")
						.text("Done! Thanks for sending")
						.removeClass('invisible')
						.addClass("message message-success animated fadeIn");

				}, 1000);
			});
		},

		buildMessage: function() {
			return {
			    "key": this._options.key,
			    "message": {
			        "html": "<p>" + this._options.description +"</p>",
			        "text": this._options.description,
			        "subject": "Contact",
			        "from_email": "acmello@acmello.us",
			        "from_name": this._options.name,
			        "to": [
			            {
			                "email": "acmello.ti@gmail.com",
			                "name": "Antonio Mello",
			                "type": "to"
			            }
			        ],
			        "headers": {
			            "Reply-To": "message.reply@example.com"
			        },
				}
			};
		}
	};

	global.Mail = Mail;

})(window);