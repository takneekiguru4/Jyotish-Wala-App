/* JyotishWala WordPress Admin Interactive Helpers */
jQuery(document).ready(function ($) {
	// Toggle secret API key visibility in API Vault table
	$('.jw-toggle-secret').on('click', function (e) {
		e.preventDefault();
		var $btn = $(this);
		var $target = $($btn.data('target'));
		var masked = $target.data('masked');
		var full = $target.data('full');

		if ($target.attr('data-showing') === '1') {
			$target.text(masked).attr('data-showing', '0');
			$btn.text('Show');
		} else {
			$target.text(full).attr('data-showing', '1');
			$btn.text('Hide');
		}
	});

	// WordPress Media Uploader helper for Single Image (Logo / Banner / Gallery Cover / Pandit Avatar / Pandit QR Code)
	$(document).on('click', '.jw-media-upload-btn', function (e) {
		e.preventDefault();
		var $btn = $(this);
		var targetInput = $($btn.data('input'));
		var previewSelector = $btn.data('preview');
		var frameTitle = $btn.data('title') || 'Select or Upload Image for JyotishWala App';

		var frame = wp.media({
			title: frameTitle,
			button: { text: 'Use This Image' },
			multiple: false
		});

		frame.on('select', function () {
			var attachment = frame.state().get('selection').first().toJSON();
			if (attachment && attachment.url) {
				targetInput.val(attachment.url).trigger('change');
				if (previewSelector && $(previewSelector).length) {
					$(previewSelector).attr('src', attachment.url).show();
				}
			}
		});

		frame.open();
	});

	// WordPress Media Uploader helper for Multi-Photo Group Albums in Gallery
	$(document).on('click', '.jw-media-multi-upload-btn', function (e) {
		e.preventDefault();
		var $btn = $(this);
		var targetTextarea = $($btn.data('textarea'));
		var coverInput = $($btn.data('cover'));

		var frame = wp.media({
			title: 'Select Multiple Photos for Puja Group Album',
			button: { text: 'Add Selected Photos to Album' },
			multiple: true
		});

		frame.on('select', function () {
			var selection = frame.state().get('selection');
			var urls = [];
			selection.map(function (attachment) {
				var item = attachment.toJSON();
				if (item && item.url) {
					urls.push(item.url);
				}
			});
			if (urls.length > 0) {
				var existing = $.trim(targetTextarea.val());
				var combined = existing ? existing + '\n' + urls.join('\n') : urls.join('\n');
				targetTextarea.val(combined);
				if (coverInput.length && !$.trim(coverInput.val())) {
					coverInput.val(urls[0]);
				}
			}
		});

		frame.open();
	});
});
