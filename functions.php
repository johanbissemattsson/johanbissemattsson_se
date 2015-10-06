<?php
/**
 * johanbissemattsson functions and definitions
 *
 * @package johanbissemattsson
 */

/**
 * Set the content width based on the theme's design and stylesheet.
 */
if ( ! isset( $content_width ) ) {
	$content_width = 640; /* pixels */
}

if ( ! function_exists( 'johanbissemattsson_setup' ) ) :
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function johanbissemattsson_setup() {

	/*
	 * Make theme available for translation.
	 * Translations can be filed in the /languages/ directory.
	 * If you're building a theme based on johanbissemattsson, use a find and replace
	 * to change 'johanbissemattsson' to the name of your theme in all the template files
	 */
	load_theme_textdomain( 'johanbissemattsson', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
	 * Let WordPress manage the document title.
	 * By adding theme support, we declare that this theme does not use a
	 * hard-coded <title> tag in the document head, and expect WordPress to
	 * provide it for us.
	 */
	add_theme_support( 'title-tag' );

	/*
	 * Enable support for Post Thumbnails on posts and pages.
	 *
	 * @link http://codex.wordpress.org/Function_Reference/add_theme_support#Post_Thumbnails
	 */
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'johanbissemattsson' ),
	) );

	/*
	 * Switch default core markup for search form, comment form, and comments
	 * to output valid HTML5.
	 */
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption',
	) );

	/*
	 * Enable support for Post Formats.
	 * See http://codex.wordpress.org/Post_Formats
	 */
	add_theme_support( 'post-formats', array(
		'status',
	) );

	// Set up the WordPress core custom background feature.
	add_theme_support( 'custom-background', apply_filters( 'johanbissemattsson_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
endif; // johanbissemattsson_setup
add_action( 'after_setup_theme', 'johanbissemattsson_setup' );

/**
 * Enqueue scripts and styles.
 */
function johanbissemattsson_scripts() {
	wp_enqueue_style( 'johanbissemattsson-style', get_stylesheet_uri() );

	//wp_enqueue_script( 'johanbissemattsson-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20120206', true );

	wp_enqueue_script( 'johanbissemattsson-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20130115', true );

	wp_enqueue_script( 'johanbissemattsson-scripts', get_template_directory_uri() . '/js/main-dist.js', array('jquery', 'isotope', 'images-loaded', 'angular-images-loaded', 'angularjs', 'angularjs-uirouter', 'angularjs-uirouter-extras', 'angularjs-sanitize', 'angularjs-animate'),'1.0', true );

	wp_deregister_script( 'jquery' );
	wp_register_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js', array(), '1.11.3', true );

	wp_register_script( 'jquery-ui', get_template_directory_uri() . 'js/vendor/jquery-ui.min.js', array('jquery') );

	wp_register_script( 'angularjs', get_template_directory_uri() . '/js/vendor/angular.js', array('jquery', 'isotope' ));

	wp_register_script( 'angularjs-uirouter', get_template_directory_uri() . '/js/vendor/angular-ui-router.min.js', array('jquery', 'angularjs'));

	wp_register_script( 'angularjs-uirouter-extras', get_template_directory_uri() . '/js/vendor/ct-ui-router-extras.min.js', array('jquery', 'angularjs', 'angularjs-uirouter')); //använd endast stickymodulen i framtiden

	wp_register_script( 'angularjs-sanitize', '//ajax.googleapis.com/ajax/libs/angularjs/1.3.16/angular-sanitize.js', array('jquery', 'angularjs'));

	wp_register_script( 'angularjs-animate', '//ajax.googleapis.com/ajax/libs/angularjs/1.3.16/angular-animate.js', array('jquery', 'angularjs'));

	wp_register_script( 'isotope', '//cdnjs.cloudflare.com/ajax/libs/jquery.isotope/2.2.0/isotope.pkgd.min.js', array('jquery'), '2.2.0', true );

	wp_register_script( 'images-loaded', 'https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.pkgd.min.js', array('jquery', 'isotope'));

	wp_register_script( 'angular-images-loaded', get_template_directory_uri() . '/js/vendor/angular-images-loaded.js' , array('jquery', 'angularjs', 'isotope', 'images-loaded'));

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'johanbissemattsson_scripts' );

if( function_exists('acf_add_options_page') ) {	
	acf_add_options_page();
	acf_set_options_page_title( __('Header & Footer') );	
}

/**
 * Implement the Custom Header feature.
 */
//require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';

// Disable support for comments and trackbacks in post types
function df_disable_comments_post_types_support() {
	$post_types = get_post_types();
	foreach ($post_types as $post_type) {
		if(post_type_supports($post_type, 'comments')) {
			remove_post_type_support($post_type, 'comments');
			remove_post_type_support($post_type, 'trackbacks');
		}
	}
}
add_action('admin_init', 'df_disable_comments_post_types_support');

// Close comments on the front-end
function df_disable_comments_status() {
	return false;
}
add_filter('comments_open', 'df_disable_comments_status', 20, 2);
add_filter('pings_open', 'df_disable_comments_status', 20, 2);

// Hide existing comments
function df_disable_comments_hide_existing_comments($comments) {
	$comments = array();
	return $comments;
}
add_filter('comments_array', 'df_disable_comments_hide_existing_comments', 10, 2);

// Remove comments page in menu
function df_disable_comments_admin_menu() {
	remove_menu_page('edit-comments.php');
}
add_action('admin_menu', 'df_disable_comments_admin_menu');

// Redirect any user trying to access comments page
function df_disable_comments_admin_menu_redirect() {
	global $pagenow;
	if ($pagenow === 'edit-comments.php') {
		wp_redirect(admin_url()); exit;
	}
}
add_action('admin_init', 'df_disable_comments_admin_menu_redirect');

// Remove comments metabox from dashboard
function df_disable_comments_dashboard() {
	remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
}
add_action('admin_init', 'df_disable_comments_dashboard');

// Remove comments links from admin bar
function df_disable_comments_admin_bar() {
	if (is_admin_bar_showing()) {
		remove_action('admin_bar_menu', 'wp_admin_bar_comments_menu', 60);
	}
}
add_action('add_admin_bar_menus', 'df_disable_comments_admin_bar');

// Add Advanced Custom Fields to JSON

add_filter('json_prepare_post', 'json_api_encode_acf');

function json_api_encode_acf($post) {
    
    $acf = get_fields($post['ID']);
    
    if (isset($post)) {
      $post['acf'] = $acf;
    }

    return $post;

}

// Build JSON cache file

function build_json_file() {
	
	$posts = wp_remote_retrieve_body( wp_remote_get( get_site_url() . '/wp-json/posts/', array( 'timeout' => 120) ));
	$pages = wp_remote_retrieve_body( wp_remote_get( get_site_url() . '/wp-json/pages/', array( 'timeout' => 120) ));

	$postsarray = json_decode( $posts, true );
	$pagesarray = json_decode( $pages, true );
	$postsandpagesarray = array_merge_recursive( $postsarray, $pagesarray );
	$postsandpages = json_encode( $postsandpagesarray );

	$upload_dir = wp_upload_dir();    
	$path = $upload_dir['basedir'] . '/json/';
	$file = trailingslashit($path) . 'sitedata.json';
	
	if ( ! file_exists($path) ) {
		mkdir($path, 0755);
	}
	
	file_put_contents($file, $postsandpages);

}

add_action('save_post', 'build_json_file' );
add_action('delete_post', 'build_json_file' );
