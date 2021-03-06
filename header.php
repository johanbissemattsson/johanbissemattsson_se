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
<body class="single">
<?php } ?>
<div id="page" class="hfeed site">

	<?php if ( is_front_page() ) { ?>
	<header id="masthead" class="site-header" role="banner">
	<?php } else { ?>
	<header id="masthead" class="site-header minified" role="banner">
	<?php } ?>
		<div class="site-branding">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" ng-click="gotoTop()"><h1 class="site-title"><?php bloginfo( 'name' ); ?></h1></a>
		</div><!-- .site-branding -->
	</header><!-- #masthead -->

	<div id="content" class="site-content content-view" content-view ui-view="contentView">	