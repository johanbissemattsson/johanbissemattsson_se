<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package johanbissemattsson
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?> ng-app="app" ng-controller="MainController">
<head>
<base href="/johanbissemattsson/">
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<?php wp_head(); ?>
</head>
<?php if ( is_front_page() ) { ?>
<body>
<?php } else { ?>
<body class="post">
<?php } ?>
<div id="page" class="hfeed site">
	<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'johanbissemattsson' ); ?></a>

	<?php if ( is_front_page() ) { ?>
	<header id="masthead" class="site-header" role="banner">
	<?php } else { ?>
	<header id="masthead" class="site-header minified" role="banner">
	<?php } ?>
		<div class="site-branding">
			<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" ng-click="gotoTop()"><?php bloginfo( 'name' ); ?></a></h1>
		</div><!-- .site-branding -->
	</header><!-- #masthead -->