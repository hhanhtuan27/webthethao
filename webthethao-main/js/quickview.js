$(document).on('click', '.quick-view', function(e) {
	if($(window).width() > 1025){
		e.preventDefault();
		var productHandle = $(this).data("handle"),
			quickView= $("#quickview"),
			thumbList = quickView.find(".thumblist");
		//Get content
		quickViewGetContent(productHandle);
		//Show
		thumbList.parent().removeClass('op1');
		quickView.modal();
		setTimeout(function(){ thumbList.parent().addClass('op1'); }, 700);		
	}
});

//Load content quickview
function quickViewGetContent(productHandle){
	Bizweb.getProduct(productHandle,function(product) {				
		var quickView= $("#quickview");
		//Reset
		quickView.find('.selector-wrapper').remove();
		quickView.find('.swatch').remove();
		quickView.find('form > input').remove();
		//ID
		quickView.find(".variants > select").attr("id", "product-select-" + product.id);
		//Image
		var featuredImage = product.featured_image;
		if(featuredImage == null){
			featuredImage = 'https://bizweb.dktcdn.net/thumb/grande/assets/themes_support/noimage.gif';
		}
		//Other info

		var $info = $('.info-other');
		$info.html("");
		$info.hide();
		if(product.vendor){
			$info.show();
			$info.append('<p><label class="inline-block">Hãng sản xuất</label>: '+ product.vendor +'</p>')
		}
		if(product.product_type){
			$info.show();
			$info.append('<p><label class="inline-block">Loại sản phẩm</label>: '+ product.product_type +'</p>')
		}

		quickView.find(".product-featured-image-quickview").attr("src",featuredImage);
		var thumbList = quickView.find(".thumblist");				
		thumbList.html('<div class="thumblist_carousel owl-carousel"></div>');
		if (product.images.length > 1) {
			for (i in product.images) {
				var imageBig = Bizweb.resizeImage(product.images[i], "grande"),
					imageSmall = Bizweb.resizeImage(product.images[i], "compact"),
					imageItem = '<div class="item"><img data-image="'+ imageBig +'" src="' + imageSmall + '" alt="Proimage" /></div>';
				thumbList.find('.thumblist_carousel').append(imageItem);				
			}
		}
		//Create slider thumb(Ở đấy thêm carousel thì như này, còn nếu swipper thì thêm các class của swipper và gọi swipper nhé)
		thumbList.find('.thumblist_carousel').removeClass('owl-loaded owl-drag');			
		thumbList.parent().removeClass('op1');
		thumbList.find('.thumblist_carousel').owlCarousel({
			loop:false,
			margin:15,
			responsiveClass:true,
			dots:false,
			nav:true,
			navText: ["<i class='fa fa-angle-left' aria-hidden='true'></i>","<i class='fa fa-angle-right' aria-hidden='true'></i>"],
			responsive:{
				0:{
					items:3	
				},
				543:{
					items:3	
				},
				768:{
					items:4
				},
				992:{
					items:4
				},
				1200:{
					items:4
				}
			}
		});

		//Change image thumb click
		thumbList.find('img').click(function(e){
			quickView.find(".product-featured-image-quickview").attr("src",$(this).attr('data-image'));
		});
		//Description

		if(product.summary != null && product.summary !=""){
			var productDes = product.summary;
		}else{
			if(product.content != null){
				var productDes = product.content.replace(/(&nbsp;|(<([^>]+)>))/ig,'');
				productDes = productDes.split(" ").splice(0,30).join(" ")+"...";
			}else{
				var productDes = "";
			}
		}
		//Other info (Nếu cần thêm các trường thông tin khác như Hãng, Loại, Tình trạng thì thêm dưới chỗ này luôn nhé)
		quickView.find(".product-name a").text(product.name);
		if (productDes == ""){
			quickView.find(".product-description").hide();
		}else{
			quickView.find(".product-description").show();
			quickView.find(".product-description").html(productDes);
		}
		quickView.find(".view-more").attr('href',product.url);
		quickView.find(".product-name a").attr('href',product.url);

		//Price 
		quickViewPrice(quickView, product.price,product.compare_at_price_max);

		//Action
		quickViewAction(quickView,product);

		//Variant
		quickViewVariantsSwatch(product, quickView);
	});
}
//Create variant function
function quickViewVariantsSwatch(t, quickView) {
	var v = '<input type="hidden" name="id" value="' + t.id + '">';
	quickView.find("form.variants").append(v);

	if (t.variants.length > 1) {
		quickView.find('.selector-wrapper').remove();
		for (var r = 0; r < t.variants.length; r++) {
			var i = t.variants[r];
			var s = '<option value="' + i.id + '">' + i.title + "</option>";
			quickView.find("form.variants > select").append(s)
		}

		//selectCallbackquickView
		var ps = "product-select-" + t.id;
		new Bizweb.OptionSelectors( ps, {
			product: t,
			onVariantSelected: selectCallbackquickView
		});

		//Fix 1 variant
		if (t.options.length == 1) {
			quickView.find(".selector-wrapper:eq(0)").prepend("<label>" + t.options[0].name + "</label>")
		}

		var options="";				
		quickView.find('.swatch').remove();
		for (var i = 0; i < t.options.length; i++) {
			options += '<div class="swatch clearfix" data-option-index="' + i + '">';
			options += '<div class="header">' + t.options[i].name + ': </div>';
			//Check Variant Color
			var is_color = false;
			if (/Color|Colour|Màu/i.test(t.options[i].name)) {
				is_color = true;
			}
			//Fill Options
			var optionValues = new Array();
			for (var j = 0; j < t.variants.length; j++) {
				var variant = t.variants[j];
				var value = variant.options[i];
				var valueHandle = awe_convertVietnamese(value);
				var forText = 'swatch-' + i + '-' + valueHandle;
				if (optionValues.indexOf(value) < 0) {
					//
					if(variant.featured_image != null){
						options += '<div data-image="'+variant.featured_image.src+'" data-value="' + value + '" class="swatch-element ' + (is_color ? "color " : " ") + valueHandle + (variant.available ? ' available ' : ' soldout ') + '">';
					}else{
						options += '<div  data-value="' + value + '" class="swatch-element ' + (is_color ? "color " : " ") + valueHandle + (variant.available ? ' available ' : ' soldout ') + '">';
					}
					if (is_color) {
						options += '<div class="tooltip">' + value + '</div>';
					}
					options += '<input id="' + forText + '" type="radio" name="option-' + i + '" value="' + value + '" ' + (j == 0 ? ' checked ' : '') + (variant.available ? '' : '') + ' />';

					if (is_color) {
						if(variant.featured_image){
							options += '<label for="' + forText + '" class="'+valueHandle+'" style="background-color: ' + valueHandle + ';background-image:url('+variant.featured_image.src+');background-size: 26px 26px;"></label>';
						}else{
							options += '<label for="' + forText + '" class="'+valueHandle+'" style="background-color: ' + valueHandle + ';background-size: 26px 26px;"></label>';
						}
					} else {
						options += '<label for="' + forText + '">' + value + '</label>';
					}
					options += '</div>';					
					optionValues.push(value);
				}
			}
			options += '</div>';
		}
		quickView.find('form.variants > select').after(options);

		//Change Swatch	variant
		quickView.find('.swatch :radio').change(function() {
			var optionIndex = $(this).closest('.swatch').attr('data-option-index');
			var optionValue = $(this).val();
			$(this)
				.closest('form')
				.find('.single-option-selector')
				.eq(optionIndex)
				.val(optionValue)
				.trigger('change');					
		});
		//Add label
		quickView.find("form.variants .selector-wrapper label").each(function(n, r) {
			$(this).html(t.options[n].name)
		})
	}
	else {
		var q = '<input type="hidden" name="variantId" value="' + t.variants[0].id + '">';
		quickView.find("form.variants").append(q);
	}
}

//Callback
function selectCallbackquickView(variant, selector) {
	var quickView= $("#quickview");
	var price = quickView.find(".product-price"),
		comparePrice = quickView.find(".product-price-old"),
		form = quickView.find(".variants"),
		action = quickView.find(".quantity_wanted_p"),
		btn = form.find('button');

	if (variant) {
		/*Change variant image*/
		if (variant && variant.featured_image) {
			quickView.find(".product-featured-image-quickview").attr("src",variant.featured_image.src);
		}


		quickViewAction(quickView,variant);
		quickViewPrice(quickView,variant.price,variant.compare_at_price);
		if (variant.available) {
			var form = jQuery('#' + selector.domIdPrefix).closest('form');
			for (var i=0,length=variant.options.length; i<length; i++) {
				var radioButton = form.find('.swatch[data-option-index="' + i + '"] :radio[value="' + variant.options[i] +'"]');
				if (radioButton.size()) {
					radioButton.get(0).checked = true;
				}
			}
		}

	} else {		
		quickViewPrice(quickView,0,0);
	}
};

//Function update action
function quickViewAction(quickView,obj){			
	var btn = quickView.find('form button');
	if (!obj.available) {
		btn.text("Hết hàng").addClass("disabled").attr("disabled", "disabled");
		$('#quickview .inventory').html('Hết hàng');
	}else{
		btn.text("Thêm vào giỏ hàng").removeClass("disabled").removeAttr('disabled');
		$('#quickview .inventory').html('Còn hàng');
	}
}

//Function Check Price
function quickViewPrice(quickView,productPrice, productCompare_price){	

	var price = quickView.find(".product-price"),
		comparePrice = quickView.find(".product-price-old"),
		form = quickView.find(".variants"),
		action = quickView.find(".quantity_wanted_p"),
		btn = form.find('button');
	//Check contact
	if(productPrice == 0 ){
		price.text('Liên hệ');
		comparePrice.hide();
		action.hide();
		$('#quickview .inventory').html('Liên hệ');
	}else{
		//If price # 0 show form action.
		action.show();
		//Get price

		price.text(Bizweb.formatMoney(productPrice, "{{amount_no_decimals_with_comma_separator}}₫" ));			
		if(productCompare_price > productPrice){

			var pt = ((productCompare_price - productPrice))/productCompare_price * 100;
			comparePrice.html('Giá gốc: <del class="price product-price-old" >' + Bizweb.formatMoney(productCompare_price, "{{amount_no_decimals_with_comma_separator}}₫") + '</del> <span class="discount">(-'+ Math.ceil(pt) +'%)</span>').show();
		}else{
			comparePrice.hide();
		}

	}
}