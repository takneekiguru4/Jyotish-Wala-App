<?php
/**
 * Centralized Settings & Structured Content Manager for JyotishWala Backend.
 *
 * Manages:
 * 1. App Settings (jw_app_settings)
 * 2. Panchang Settings (jw_panchang_settings) - Default: Rishikesh, Uttarakhand, Asia/Kolkata
 * 3. Kundli & Jyotish Settings (jw_kundli_settings) - Default: Lahiri Chitra Paksha Ayanamsha
 * 4. Security Settings (jw_security_settings)
 * 5. Complete Structured Devotional & Static Page Content (jw_site_pages_content):
 *    - SankalpContentConfig (with Desh/Kala clauses, steps, benefits, laghu, vistrit, notes 1-3)
 *    - AboutUsContentConfig (with intro, mission, 3 pillars, tradition, founder, features, statistics, acharyaMessage)
 *    - PrivacyPolicyContentConfig (with all 5 structured sections, badge, lastUpdated, contactEmail)
 *    - GalleryPageMeta (with categories list, Teal Banner Card, 3 stats, and Bottom Contact Card)
 *    - ReviewSystemMeta (with section titles and auto-approve toggle)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class JW_Settings {

	/**
	 * Ensures all default options exist in wp_options.
	 */
	public static function ensure_defaults() {
		if ( false === get_option( 'jw_app_settings' ) ) {
			update_option( 'jw_app_settings', self::default_app_settings() );
		}
		if ( false === get_option( 'jw_panchang_settings' ) ) {
			update_option( 'jw_panchang_settings', self::default_panchang_settings() );
		}
		if ( false === get_option( 'jw_kundli_settings' ) ) {
			update_option( 'jw_kundli_settings', self::default_kundli_settings() );
		}
		if ( false === get_option( 'jw_security_settings' ) ) {
			update_option( 'jw_security_settings', self::default_security_settings() );
		}
		if ( false === get_option( 'jw_site_pages_content' ) ) {
			update_option( 'jw_site_pages_content', self::default_site_pages_content() );
		} else {
			// Ensure newly added structured keys are merged into existing option without overwriting custom edits
			$existing = get_option( 'jw_site_pages_content', array() );
			$merged   = self::get_site_pages_content( $existing );
			update_option( 'jw_site_pages_content', $merged );
		}
	}

	public static function default_app_settings() {
		return array(
			'app_name'                 => 'JyotishWala',
			'app_tagline_hi'           => 'ऋषिकेश पंचांग, जन्मकुंडली एवं वैदिक ज्योतिष',
			'app_tagline_en'           => 'Rishikesh Panchang, Birth Chart & Vedic Astrology',
			'app_logo_url'             => '',
			'app_version'              => '2.5.0',
			'default_language'         => 'hi',
			'supported_languages'      => array( 'hi', 'en' ),
			'contact_email'            => 'jyotishwaala@gmail.com',
			'contact_phone'            => '+91 98765 43210',
			'contact_address'          => 'तपोवन, ऋषिकेश, उत्तराखंड - 249192',
			'privacy_policy_url'       => 'https://jyotishwala.com/privacy-policy',
			'terms_url'                => 'https://jyotishwala.com/terms-and-conditions',
			'maintenance_mode'         => 0,
			'maintenance_message'      => 'ऐप में आवश्यक वैदिक अपडेट कार्य चल रहा है। कृपया कुछ समय पश्चात पुनः प्रयास करें।',
			'enable_panchang'          => 1,
			'enable_kundli'            => 1,
			'enable_milan'             => 1,
			'enable_rashifal'          => 1,
			'enable_gochar'            => 1,
			'enable_tyohar'            => 1,
			'enable_calculators'       => 1,
			'enable_dharma'            => 1,
			'enable_sankalp'           => 1,
			'enable_pandit_chat'       => 1,
			'enable_articles'          => 1,
			'enable_gallery'           => 1,
			'enable_reviews'           => 1,
			'enable_banners'           => 1,
			'enable_gyan'              => 1,
			'enable_puja_vidhi'        => 1,
			'enable_sanskrit'          => 1,
			'enable_temples'           => 1,
			'enable_puja_booking'      => 1,
			'enable_personal_library'  => 1,
			'enable_support_tickets'   => 1,
			'home_sections_order'      => 'banners,panchang,quick_actions,sankalp,rashifal,tyohar,articles,reviews',
			'delete_data_on_uninstall' => 0,
		);
	}

	public static function default_panchang_settings() {
		return array(
			'default_city_name'      => 'ऋषिकेश (Rishikesh), उत्तराखंड, भारत',
			'default_latitude'       => 30.0869,
			'default_longitude'      => 78.2676,
			'default_timezone'       => 'Asia/Kolkata',
			'calculation_provider'   => 'built_in_siddhantic',
			'panchang_paksha_system' => 'purnimanta',
			'ayanamsha_type'         => 'lahiri_chitra_paksha',
			'show_tithi'             => 1,
			'show_vara'              => 1,
			'show_nakshatra'         => 1,
			'show_yoga'              => 1,
			'show_karana'            => 1,
			'show_sunrise_sunset'    => 1,
			'show_rahu_kaal'         => 1,
			'show_yamaganda'         => 1,
			'show_gulika'            => 1,
			'show_abhijit_muhurta'   => 1,
			'show_chaughadiya'       => 1,
		);
	}

	public static function default_kundli_settings() {
		return array(
			'calculation_engine'       => 'built_in_lahiri',
			'ayanamsha'                => 'lahiri',
			'house_system'             => 'whole_sign_equal',
			'chart_style_default'      => 'north_indian',
			'node_type'                => 'mean_node',
			'dasha_system'             => 'vimshottari_120',
			'dasha_year_length_days'   => 365.25,
			'enable_navamsha_d9'       => 1,
			'enable_chandra_chart'     => 1,
			'enable_avakahada'         => 1,
			'enable_ashtakoot_milan'   => 1,
			'enable_manglik_check'     => 1,
			'minimum_recommended_guna' => 18,
		);
	}

	public static function default_security_settings() {
		return array(
			'enable_rate_limiting'     => 1,
			'rate_limit_per_minute'    => 60,
			'token_expiry_days'        => 30,
			'allow_user_registration'  => 1,
			'require_https'            => 1,
			'fcm_enabled'              => 0,
			'fcm_project_id'           => '',
			'fcm_default_topic'        => 'jyotishwala_all',
			'fcm_service_account_enc'  => '',
		);
	}

	/**
	 * Original SankalpContentConfig from src/services/siteContentService.ts
	 * plus structured Desh/Kala clauses, steps and benefits.
	 */
	public static function default_sankalp_content() {
		return array(
			'title'           => 'संकल्प मंत्र',
			'tagline'         => 'दैनिक पूजा, व्रत एवं अनुष्ठान हेतु प्रामाणिक वैदिक संकल्प विधि',
			'laghuTitle'      => 'नित्य दैनिक पूजा हेतु संक्षिप्त संकल्प',
			'laghuSubtitle'   => 'प्रातःकाल अथवा सांध्यकालीन नित्य देवपूजन, दीप प्रज्वलन व जप हेतु',
			'laghuText'       => 'ॐ विष्णुर्विष्णुर्विष्णुः श्रीमद्भगवतो महापुरुषस्य विष्णोराज्ञया प्रवर्तमानस्य, अद्य ब्रह्मणो द्वितीये परार्धे, श्रीश्वेतवाराहकल्पे, वैवस्वतमन्वन्तरे, अष्टाविंशतितमे कलियुगे, कलिप्रथमचरणे, जम्बूद्वीपे, भारतवर्षे, भरतखण्डे, आर्यावर्तैकदेशान्तर्गत पुण्यप्रदेशे, {संवत्सर} नाम संवत्सरे, {अयन}े, {ऋतु} ऋतौ, महामांगल्यप्रदे {मास} मासे, {पक्ष}े, {तिथि} तिथौ, {वार} वासरे, {नक्षत्र} नक्षत्रे, {योग} योगे, {करण} करणे, {चन्द्र_राशि} राशिस्थे चन्द्रे, {सूर्य_राशि} राशिस्थे सूर्ये, {बृहस्पति_राशि} राशिस्थे देवगुरौ, [अमुक] गोत्रोत्पन्नः [अमुक] नामाऽहं, मम सकलदुरितोपशमनार्थं, श्रीपरमेश्वरप्रीत्यर्थं [अमुक] देवस्य पूजनं/जपं करिष्ये।',
			'vistritTitle'    => 'महापूजा, अनुष्ठान व हवन हेतु विस्तृत संकल्प',
			'vistritSubtitle' => 'सत्यनारायण कथा, रुद्राभिषेक, नवग्रह शांति, यज्ञ एवं विशेष व्रत अनुष्ठान हेतु',
			'vistritText'     => 'ॐ तत्सत्। ॐ अद्य ब्रह्मणोऽह्नि द्वितीये परार्धे श्रीश्वेतवाराहकल्पे वैवस्वतमन्वन्तरे अष्टाविंशतितमे कलियुगे कलिप्रथमचरणे बौद्धसप्ताहे जम्बूद्वीपे भारतवर्षे भरतखण्डे आर्यावर्तैकदेशान्तर्गत-पुण्यप्रदेशे, पवित्र-तीर्थक्षेत्रे, {संवत्सर} नाम संवत्सरे, {अयन}े, {ऋतु} ऋतौ, महामांगल्यप्रदे {मास} मासे, {पक्ष}े, {तिथि} तिथौ, {वार} वासरे, {नक्षत्र} नक्षत्रे, {योग} योगे, {करण} करणे, {चन्द्र_राशि} राशिस्थे चन्द्रे, {सूर्य_राशि} राशिस्थे सूर्ये, {बृहस्पति_राशि} राशिस्थे देवगुरौ शेषेषु ग्रहेषु यथायथा राशिस्थानस्थितेषु सत्सु एवं ग्रहगुणविशेषेण विशिष्टायां शुभपुण्यतिथौ, [अमुक] गोत्रोत्पन्नः [अमुक] नामाऽहं, ममोपात्त-दुरितक्षयद्वारा श्रीपरमेश्वर-प्रीतिकामनया, मम सपरिवारस्य ऐहिक-पारलौकिक-सकल-मनोरथ-सिद्ध्यर्थं, धर्मार्थकाममोक्ष-फलप्राप्त्यर्थं, आयुर्बल-यशः-श्री-कीर्ति-प्रवृद्ध्यर्थं, सर्वोपद्रव-शान्तिपूर्वक-दीर्घायुष्य-आरोग्य-अभिवृद्ध्यर्थं च अद्य [अमुक] देवस्य षोडशोपचार-पूजनं/हवनं करिष्ये। ॐ तत्सत् न मम्।',
			'note1Title'      => '1. संकल्प के अंदर कोष्ठक में [अमुक] की जगह क्या बोलें?',
			'note1Text'       => "• [अमुक] गोत्र: अपने वंश का मूल गोत्र बोलें (जैसे: भारद्वाज, कश्यप, वशिष्ठ आदि)। यदि गोत्र ज्ञात न हो तो ‘कश्यप गोत्र’ बोलें।\n• [अमुक] नाम: अपना स्वयं का वास्तविक या जन्म नाम बोलें (जैसे: परेश्वर शर्मा)।\n• [अमुक] देवस्य: जिस देवी या देवता की पूजा कर रहे हैं उनका नाम लें (जैसे: श्रीगणेश, शिवजी, हनुमानजी, महालक्ष्मी आदि)।",
			'note2Title'      => '2. पूजा में संकल्प क्यों किया जाता है?',
			'note2Text'       => 'शास्त्रों में कहा गया है: ‘विना संकल्पात् कर्म न सिद्ध्यति’ अर्थात् बिना संकल्प के किया गया कोई भी धार्मिक कर्म निष्फल हो जाता है। संकल्प द्वारा व्यक्ति ब्रह्मांडीय देश, काल (समय, संवत, नक्षत्र) और अपने अस्तित्व (गोत्र, नाम) को साक्षी मानकर ईश्वर के प्रति अपनी भक्ति व कार्य का दायित्व तय करता है।',
			'note3Title'      => '3. संकल्प लेते समय हाथ में क्या सामग्री रखनी चाहिए?',
			'note3Text'       => 'दाएं हाथ की हथेली में थोड़ा जल, अक्षत (बिना टूटे चावल), पुष्प, दूर्वा, रोली और तांबे या चांदी का सिक्का/द्रव्य लेकर संकल्प पाठ करें। संकल्प पूर्ण होने पर समस्त सामग्री को ताम्रपात्र में अथवा भगवान के सम्मुख समर्पित कर दें।',
			'deshKalaClauses' => 'जम्बूद्वीपे, भारतवर्षे, भरतखण्डे, आर्यावर्तैकदेशान्तर्गत पुण्यप्रदेशे, {संवत्सर} नाम संवत्सरे, {अयन}े, {ऋतु} ऋतौ, {मास} मासे, {पक्ष}े, {तिथि} तिथौ, {वार} वासरे, {नक्षत्र} नक्षत्रे, {योग} योगे, {करण} करणे, {चन्द्र_राशि} राशिस्थे चन्द्रे, {सूर्य_राशि} राशिस्थे सूर्ये, {बृहस्पति_राशि} राशिस्थे देवगुरौ',
			'steps'           => "1. पूर्व या उत्तर दिशा की ओर मुख करके शुद्ध आसन पर बैठें एवं आचमन-प्राणायाम करें।\n2. दाएं हाथ में जल, अक्षत, पुष्प, सुपारी एवं द्रव्य (दक्षिणा) लें।\n3. देश-काल एवं आज के 13 पंचांगीय अंगों का उच्चारण करते हुए अपना गोत्र, नाम और पूजा का उद्देश्य बोलें।\n4. 'करिष्ये' बोलकर हाथ का जल व अक्षत ताम्रपात्र या भगवान के चरणों में छोड़ दें।",
			'benefits'        => "1. शास्त्रीय नियम 'विना संकल्पात् कर्म न सिद्ध्यति' की पूर्ति होती है।\n2. मन, वाणी और कर्म की एकाग्रता बढ़ती है तथा पूजा का पूर्ण आध्यात्मिक फल प्राप्त होता है।\n3. दैनिक पंचांग के 13 अंगों के स्मरण मात्र से नवग्रहों की अनुकूलता और पापों का क्षय होता है।",
		);
	}

	/**
	 * Original AboutUsContentConfig from src/services/siteContentService.ts
	 * plus features, statistics and Acharya message.
	 */
	public static function default_about_content() {
		return array(
			'title'          => 'हमारे बारे में (About Us)',
			'tagline'        => 'JyotishWala — वैदिक ज्योतिष, शुद्ध पंचांग एवं सनातन संस्कृति का प्रामाणिक मंच',
			'introTitle'     => 'JyotishWala (ज्योतिषवाला) का परिचय',
			'introText'      => 'JyotishWala एक आधुनिक, विश्वसनीय और पूर्णतः शास्त्रीय वैदिक मंच है जिसका निर्माण प्राचीन भारतीय ऋषियों के खगोलीय व ज्योतिषीय ज्ञान को प्रत्येक श्रद्धालु और जिज्ञासु तक सरल, निष्पक्ष और पारदर्शी रूप से पहुँचाने के लिए किया गया है। यहाँ आपको पंचांग, जन्मकुंडली निर्माण, गुण मिलान, ग्रह गोचर, दैनिक राशिफल एवं धार्मिक साधनाएं बिना किसी भ्रामक विज्ञापन या अंधविश्वास के उपलब्ध कराई जाती हैं।',
			'missionTitle'   => 'हमारा उद्देश्य एवं वैदिक दृष्टि (Our Vision)',
			'missionText'    => 'हमारा मुख्य ध्येय सनातन धर्म के गहन खगोल-विज्ञान और ज्योतिष-दर्शन को आधुनिक वैज्ञानिक सटीकता के साथ प्रस्तुत करना है। आमजन को जटिल पंचांगीय गणनाओं और पूजा-अनुष्ठानों में कोई कठिनाई न हो, इसी उद्देश्य से हमने शुद्ध पंचांग, दैनिक संकल्प मंत्र और दोष-निवारण जैसी सुविधाओं को अत्यंत सुगम बनाया है।',
			'pillarsTitle'   => 'हमारे तीन मुख्य आधार स्तंभ',
			'pillar1Title'   => 'विशुद्ध गणितीय गणना',
			'pillar1Text'    => 'ऋषिकेश एवं काशी की प्रामाणिक अक्षांश-देशांतर पद्धति पर आधारित सूक्ष्म सूर्य-चंद्र व नवग्रह स्थितियां।',
			'pillar2Title'   => 'शास्त्रीय प्रामाणिकता',
			'pillar2Text'    => 'बृहत्पाराशर होराशास्त्र, जातक पारिजात एवं मुहूर्तमार्तण्ड के शास्त्रीय सिद्धांतों का अक्षरशः पालन।',
			'pillar3Title'   => 'पारदर्शी एवं निःशुल्क सेवा',
			'pillar3Text'    => 'बिना किसी छिपे शुल्क अथवा अनावश्यक भ्रामक दावों के सभी मुख्य वैदिक उपकरणों की सुलभ उपलब्धता।',
			'traditionTitle' => 'परंपरा और आधुनिक तकनीक का अद्भुत संगम',
			'traditionText'  => 'ज्योतिष केवल भविष्य जानने का साधन नहीं, बल्कि आत्म-सुधार और काल-ज्ञान का एक दिव्य दर्पण है। JyotishWala के माध्यम से हमारा प्रयास है कि भारत की यह अमूल्य धरोहर आधुनिक डिजिटल युग में भी अपनी संपूर्ण गरिमा और पवित्रता के साथ जन-जन तक पहुँचे।',
			'contactEmail'   => 'jyotishwaala@gmail.com',
			'founderName'    => 'आचार्य परेश्वर भारद्वाज (Pareshwar Bhardwaj)',
			'education'      => 'आचार्य इन पुराणेतिहास (Acharya in Puranetihas)',
			'university'     => 'सम्पूर्णानन्द संस्कृत विश्वविद्यालय, वाराणसी (उत्तर प्रदेश)',
			'acharyaMessage' => 'सनातन वैदिक ज्योतिष एवं पंचांग ऋषियों की दिव्य दृष्टि है। हमारा संकल्प है कि प्रत्येक गृहस्थ और साधक को शुद्ध मुहूर्त, प्रामाणिक जन्मकुंडली मार्गदर्शन एवं वैदिक पूजा-पद्धति घर बैठे सुलभ हो।',
			'features'       => "1. ऋषिकेश एवं काशी परंपरा आधारित दैनिक पंचांग व चौघड़िया\n2. लग्न, चंद्र, नवमांश (D9) एवं विंशोत्तरी दशा सहित निःशुल्क जन्मकुंडली\n3. अष्टकूट 36 गुण मिलान एवं मांगलिक दोष परिहार\n4. स्वचालित 13-अंगीय दैनिक वैदिक संकल्प मंत्र एवं 108 रुद्राक्ष जप माला\n5. काशी व ऋषिकेश के विद्वान आचार्यों से सीधा परामर्श",
			'statistics'     => '500+ संपन्न वैदिक अनुष्ठान | 100% शास्त्रीय लाहिड़ी चित्रापक्ष गणना | काशी-ऋषिकेश विद्वत परंपरा',
		);
	}

	/**
	 * Original PrivacyPolicyContentConfig from src/services/siteContentService.ts
	 */
	public static function default_privacy_content() {
		return array(
			'title'         => 'गोपनीयता नीति (Privacy Policy)',
			'tagline'       => 'JyotishWala पर आपकी व्यक्तिगत जानकारी, कुंडली विवरण एवं डेटा सुरक्षा नीति',
			'badgeText'     => 'डेटा गोपनीयता हमारी सर्वोच्च प्रतिबद्धता है',
			'lastUpdated'   => '5 नवंबर 2026',
			'section1Title' => '1. हम कौन सा डेटा एकत्र करते हैं?',
			'section1Text'  => 'जब आप JyotishWala का उपयोग करते हैं, तो हम केवल वही जानकारी लेते हैं जो आपकी कुंडली, मिलान या पंचांग गणना के लिए अनिवार्य होती है—जैसे नाम, जन्म तिथि, जन्म समय और शहर। यदि आप ज्योतिषी से परामर्श लेते हैं, तो संपर्क हेतु आपका ईमेल अथवा मोबाइल नंबर दर्ज किया जाता है।',
			'section2Title' => '2. आपकी जन्म कुंडली और डेटा का भंडारण (Local Storage)',
			'section2Text'  => 'आपकी सहेजी गई जन्म कुंडलियां और व्यक्तिगत सेटिंग्स मुख्य रूप से आपके अपने डिवाइस (ब्राउज़र / ऐप लोकल स्टोरेज) अथवा आपके सुरक्षित खाते में ही रहती हैं। हम आपकी अनुमति के बिना आपकी कुंडलियों या व्यक्तिगत डेटा को किसी तीसरे पक्ष (Third Party) के साथ न तो साझा करते हैं और न ही बेचते हैं।',
			'section3Title' => '3. डेटा सुरक्षा एवं एन्क्रिप्शन',
			'section3Text'  => 'JyotishWala आधुनिक SSL/TLS सुरक्षा प्रोटोकॉल का पालन करता है। सभी नेटवर्क अनुरोध सुरक्षित एवं एन्क्रिप्टेड होते हैं ताकि आपके डेटा की अखंडता बनी रहे।',
			'section4Title' => '4. कुकीज़ एवं अनुमतियाँ',
			'section4Text'  => 'हम केवल ऐप की प्राथमिक प्राथमिकताओं जैसे भाषा (हिंदी/अंग्रेजी), डार्क मोड थीम और पसंदीदा शहर को याद रखने के लिए स्थानीय भंडारण (Local Storage) का उपयोग करते हैं। हम किसी भी प्रकार के अनचाहे विज्ञापनों या क्रॉस-साइट ट्रैकिंग के लिए कुकीज़ का उपयोग नहीं करते हैं।',
			'section5Title' => '5. संपर्क एवं शिकायत निवारण',
			'section5Text'  => 'यदि आपके पास हमारी गोपनीयता नीति या अपने डेटा से संबंधित कोई प्रश्न अथवा सुझाव है, तो आप सीधे हमारे आधिकारिक ईमेल पते पर संपर्क कर सकते हैं। हमारी तकनीकी एवं ज्योतिषीय टीम 24-48 घंटों के भीतर आपकी सहायता करेगी।',
			'contactEmail'  => 'jyotishwaala@gmail.com',
		);
	}

	/**
	 * Original GalleryPageMeta from src/services/galleryService.ts
	 */
	public static function default_gallery_meta() {
		return array(
			'pageTitle'                  => 'पूजा-पाठ एवं संस्थान कार्य गैलरी',
			'pageTagline'                => 'JyotishWala संस्थान द्वारा संपन्न वैदिक पूजा-पाठ, रुद्राभिषेक, नवग्रह शांति महायज्ञ एवं ज्योतिषीय कार्यों की झलकियां',
			'countBadgeText'             => 'दिव्य झलकियां',
			'showTealBanner'             => true,
			'organizationBannerBadge'    => 'संस्थान पूजा-पाठ एवं वैदिक अनुष्ठान दर्शन',
			'organizationBannerTitle'    => 'प्रामाणिक काशी एवं ऋषिकेश परंपरा द्वारा वैदिक अनुष्ठान',
			'organizationBannerSubtitle' => 'आचार्य परेश्वर भारद्वाज एवं विद्वान वैदिक आचार्यों के सान्निध्य में संपन्न धार्मिक अनुष्ठान, हवन, कथा एवं ज्योतिष सेवा कार्य।',
			'stat1Value'                 => '500+',
			'stat1Label'                 => 'संपन्न अनुष्ठान',
			'stat2Value'                 => 'काशी-ऋषिकेश',
			'stat2Label'                 => 'वैदिक परंपरा',
			'stat3Value'                 => '100%',
			'stat3Label'                 => 'शास्त्रीय विधि',
			'categories'                 => array(
				'पूजा-पाठ व अनुष्ठान',
				'महायज्ञ एवं हवन',
				'रुद्राभिषेक एवं शिव पूजन',
				'ज्योतिष परामर्श व सम्मेलन',
				'ग्रह शांति एवं रत्न संस्कार',
				'तीर्थ एवं मंदिर दर्शन',
			),
			'showBottomCard'             => true,
			'bottomCardTitle'            => 'वैदिक पूजा-पाठ, अनुष्ठान एवं ज्योतिष परामर्श हेतु संपर्क',
			'bottomCardDescription'      => 'JyotishWala संस्थान द्वारा काशी एवं ऋषिकेश के विद्वान आचार्यों के माध्यम से महारुद्राभिषेक, महामृत्युंजय जप, नवग्रह शांति, कालसर्प व मांगलिक दोष निवारण, वास्तु पूजन तथा जन्मकुंडली परामर्श पूर्ण शास्त्रीय विधि से संपन्न कराए जाते हैं।',
			'bottomCardButtonText'       => 'पंडित जी से बात करें',
		);
	}

	/**
	 * Original ReviewSystemMeta from src/services/reviewService.ts
	 */
	public static function default_review_meta() {
		return array(
			'sectionTitle'          => 'यजमान एवं उपयोगकर्ता समीक्षाएं (User Reviews)',
			'sectionSubtitle'       => 'पंचांग, जन्मकुंडली, कुंडली मिलान, पूजा-पाठ अनुष्ठान एवं पंडित परामर्श सेवाओं पर देशभर के उपयोगकर्ताओं के अनुभव',
			'pageTitle'             => 'यजमान एवं उपयोगकर्ता समीक्षाएं',
			'pageTagline'           => 'JyotishWala की सभी ज्योतिषीय एवं वैदिक सेवाओं के लिए उपयोगकर्ताओं की प्रामाणिक राय व रेटिंग',
			'autoApproveNewReviews' => false,
		);
	}

	public static function default_site_pages_content() {
		$sankalp = self::default_sankalp_content();
		$about   = self::default_about_content();
		$privacy = self::default_privacy_content();
		$gallery = self::default_gallery_meta();
		$reviews = self::default_review_meta();

		return array(
			// Legacy flat keys for backward compatibility
			'sankalp_title'   => $sankalp['title'],
			'sankalp_intro'   => $sankalp['tagline'],
			'about_title'     => $about['title'],
			'about_mission'   => $about['missionText'],
			'privacy_title'   => $privacy['title'],
			'privacy_summary' => $privacy['section2Text'],
			'gallery_badge'   => $gallery['organizationBannerBadge'],
			'gallery_title'   => $gallery['pageTitle'],
			'gallery_desc'    => $gallery['pageTagline'],
			// Full structured objects matching TypeScript interfaces
			'sankalp'         => $sankalp,
			'about'           => $about,
			'privacy'         => $privacy,
			'galleryMeta'     => $gallery,
			'reviewMeta'      => $reviews,
		);
	}

	public static function get_app_settings() {
		$raw = wp_parse_args( get_option( 'jw_app_settings', array() ), self::default_app_settings() );
		$boolean_keys = array(
			'maintenance_mode',
			'enable_panchang',
			'enable_kundli',
			'enable_milan',
			'enable_rashifal',
			'enable_gochar',
			'enable_tyohar',
			'enable_calculators',
			'enable_dharma',
			'enable_sankalp',
			'enable_pandit_chat',
			'enable_articles',
			'enable_gallery',
			'enable_reviews',
			'enable_banners',
			'enable_gyan',
			'enable_puja_vidhi',
			'enable_sanskrit',
			'enable_temples',
			'enable_puja_booking',
			'enable_personal_library',
			'enable_support_tickets',
			'delete_data_on_uninstall',
		);
		foreach ( $boolean_keys as $bk ) {
			if ( isset( $raw[ $bk ] ) ) {
				$raw[ $bk ] = (bool) $raw[ $bk ];
			}
		}
		return $raw;
	}

	public static function get_panchang_settings() {
		$raw  = wp_parse_args( get_option( 'jw_panchang_settings', array() ), self::default_panchang_settings() );
		$bool = array(
			'show_tithi',
			'show_vara',
			'show_nakshatra',
			'show_yoga',
			'show_karana',
			'show_sunrise_sunset',
			'show_rahu_kaal',
			'show_yamaganda',
			'show_gulika',
			'show_abhijit_muhurta',
			'show_chaughadiya',
		);
		foreach ( $bool as $k ) {
			if ( isset( $raw[ $k ] ) ) {
				$raw[ $k ] = (bool) $raw[ $k ];
			}
		}
		return $raw;
	}

	public static function get_kundli_settings() {
		$raw  = wp_parse_args( get_option( 'jw_kundli_settings', array() ), self::default_kundli_settings() );
		$bool = array(
			'enable_navamsha_d9',
			'enable_chandra_chart',
			'enable_avakahada',
			'enable_ashtakoot_milan',
			'enable_manglik_check',
		);
		foreach ( $bool as $k ) {
			if ( isset( $raw[ $k ] ) ) {
				$raw[ $k ] = (bool) $raw[ $k ];
			}
		}
		return $raw;
	}

	public static function get_security_settings() {
		return wp_parse_args( get_option( 'jw_security_settings', array() ), self::default_security_settings() );
	}

	public static function get_site_pages_content( $raw = null ) {
		if ( null === $raw ) {
			$raw = get_option( 'jw_site_pages_content', array() );
		}
		if ( ! is_array( $raw ) ) {
			$raw = array();
		}

		$defaults = self::default_site_pages_content();
		$merged   = wp_parse_args( $raw, $defaults );

		$merged['sankalp']     = wp_parse_args( isset( $raw['sankalp'] ) && is_array( $raw['sankalp'] ) ? $raw['sankalp'] : array(), self::default_sankalp_content() );
		$merged['about']       = wp_parse_args( isset( $raw['about'] ) && is_array( $raw['about'] ) ? $raw['about'] : array(), self::default_about_content() );
		$merged['privacy']     = wp_parse_args( isset( $raw['privacy'] ) && is_array( $raw['privacy'] ) ? $raw['privacy'] : array(), self::default_privacy_content() );
		$merged['galleryMeta'] = wp_parse_args( isset( $raw['galleryMeta'] ) && is_array( $raw['galleryMeta'] ) ? $raw['galleryMeta'] : array(), self::default_gallery_meta() );
		if ( empty( $merged['galleryMeta']['categories'] ) || ! is_array( $merged['galleryMeta']['categories'] ) ) {
			$merged['galleryMeta']['categories'] = self::default_gallery_meta()['categories'];
		}
		$merged['reviewMeta']  = wp_parse_args( isset( $raw['reviewMeta'] ) && is_array( $raw['reviewMeta'] ) ? $raw['reviewMeta'] : array(), self::default_review_meta() );

		// Keep flat keys synchronized
		$merged['sankalp_title']   = $merged['sankalp']['title'];
		$merged['sankalp_intro']   = $merged['sankalp']['tagline'];
		$merged['about_title']     = $merged['about']['title'];
		$merged['about_mission']   = $merged['about']['missionText'];
		$merged['privacy_title']   = $merged['privacy']['title'];
		$merged['privacy_summary'] = $merged['privacy']['section2Text'];
		$merged['gallery_badge']   = $merged['galleryMeta']['organizationBannerBadge'];
		$merged['gallery_title']   = $merged['galleryMeta']['pageTitle'];
		$merged['gallery_desc']    = $merged['galleryMeta']['pageTagline'];

		return $merged;
	}

	/**
	 * Returns server-side encryption & HMAC keys derived strictly from wp-config.php constants.
	 * Never stored in MySQL or plugin files.
	 *
	 * @return array { enc_key: string, mac_key: string }
	 */
	private static function get_vault_crypto_keys() {
		$master = '';
		if ( defined( 'JW_VAULT_ENCRYPTION_KEY' ) && '' !== constant( 'JW_VAULT_ENCRYPTION_KEY' ) ) {
			$master = (string) constant( 'JW_VAULT_ENCRYPTION_KEY' );
		} else {
			$parts = array();
			foreach ( array( 'AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY', 'AUTH_SALT', 'SECURE_AUTH_SALT' ) as $const_name ) {
				if ( defined( $const_name ) ) {
					$parts[] = (string) constant( $const_name );
				}
			}
			$master = implode( '|', $parts );
		}
		if ( '' === $master ) {
			$master = wp_salt( 'auth' ) . '|' . wp_salt( 'secure_auth' );
		}

		return array(
			'enc_key' => hash_hmac( 'sha256', 'jw_vault_aes256_enc_v1', $master, true ),
			'mac_key' => hash_hmac( 'sha256', 'jw_vault_hmac256_mac_v1', $master, true ),
		);
	}

	/**
	 * Checks whether a stored string is already encrypted with the server-side vault cipher.
	 *
	 * @param string $value Stored string.
	 * @return bool
	 */
	public static function is_encrypted_secret( $value ) {
		return 0 === strpos( trim( (string) $value ), 'enc:v1:' );
	}

	/**
	 * Encrypts a sensitive API key or service account credential using AES-256-CBC + HMAC-SHA256 (Encrypt-then-MAC).
	 *
	 * @param string $plaintext Plaintext secret.
	 * @return string Encrypted payload prefixed with 'enc:v1:'
	 */
	public static function encrypt_secret( $plaintext ) {
		$plain = trim( (string) $plaintext );
		if ( '' === $plain || self::is_encrypted_secret( $plain ) ) {
			return $plain;
		}
		if ( ! function_exists( 'openssl_encrypt' ) ) {
			return $plain;
		}

		$keys   = self::get_vault_crypto_keys();
		$iv     = random_bytes( 16 );
		$cipher = openssl_encrypt( $plain, 'AES-256-CBC', $keys['enc_key'], OPENSSL_RAW_DATA, $iv );
		if ( false === $cipher ) {
			return $plain;
		}

		$hmac = hash_hmac( 'sha256', $iv . $cipher, $keys['mac_key'], true );
		return 'enc:v1:' . base64_encode( $iv . $hmac . $cipher );
	}

	/**
	 * Decrypts an 'enc:v1:' secret in memory for server-side API calls.
	 *
	 * @param string $stored_value Encrypted or legacy plaintext string.
	 * @return string Decrypted plaintext secret, or empty string if authentication fails.
	 */
	public static function decrypt_secret( $stored_value ) {
		$val = trim( (string) $stored_value );
		if ( '' === $val ) {
			return '';
		}
		if ( ! self::is_encrypted_secret( $val ) ) {
			return $val;
		}
		if ( ! function_exists( 'openssl_decrypt' ) ) {
			return '';
		}

		$b64 = substr( $val, 7 );
		$raw = base64_decode( $b64, true );
		if ( false === $raw || strlen( $raw ) <= 48 ) {
			return '';
		}

		$iv     = substr( $raw, 0, 16 );
		$hmac   = substr( $raw, 16, 32 );
		$cipher = substr( $raw, 48 );

		$keys     = self::get_vault_crypto_keys();
		$calc_mac = hash_hmac( 'sha256', $iv . $cipher, $keys['mac_key'], true );
		if ( ! hash_equals( $hmac, $calc_mac ) ) {
			return '';
		}

		$decrypted = openssl_decrypt( $cipher, 'AES-256-CBC', $keys['enc_key'], OPENSSL_RAW_DATA, $iv );
		return ( false !== $decrypted ) ? $decrypted : '';
	}

	/**
	 * Masks a secret API key or URL for safe display in Admin UI (decrypting in memory if encrypted).
	 *
	 * @param string $value Secret string (encrypted or plaintext).
	 * @return string
	 */
	public static function mask_secret( $value ) {
		$raw = trim( (string) $value );
		if ( '' === $raw ) {
			return 'Not Configured';
		}
		$val = self::is_encrypted_secret( $raw ) ? self::decrypt_secret( $raw ) : $raw;
		if ( '' === $val ) {
			return 'Encrypted (Key Mismatch)';
		}
		if ( strlen( $val ) <= 10 ) {
			return '************';
		}
		return substr( $val, 0, 4 ) . str_repeat( '*', 12 ) . substr( $val, -3 );
	}
}
