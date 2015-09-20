<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package johanbissemattsson
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
		
			<div class="index-view" index-view ui-view="indexView" autoscroll="false">
				<div class="site-description homepage-description">
					<?php
						$homepage = get_page_by_title('Home'); 
						$homepagecontent = apply_filters('the_content', $homepage->post_content);
						echo $homepagecontent;
					?>
				</div>

				<div class="grid effect" images-loaded="imgLoadedEvents">
					<div class="grid-sizer"></div>
					<div class="gutter-sizer"></div>
					
					<?php 		
					// WP_Query arguments
					$args = array (
						'post_type' => 'post',					
					);

					// The Query
					$query = new WP_Query( $args );

					// The Loop
					if ( $query->have_posts() ) {
						while ( $query->have_posts() ) {
							$query->the_post();
							get_template_part( 'content', get_post_format() );
						}
					} else {
						// no posts found
						get_template_part( 'content', 'none' );
					}

					// Restore original Post Data
					wp_reset_postdata();
					?>
						
				</div>
			</div>

			<div class="post-view" post-view ui-view="postView" autoscroll="false"></div>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_footer(); ?>
