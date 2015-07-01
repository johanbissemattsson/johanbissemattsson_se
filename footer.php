<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package johanbissemattsson
 */
?>

	</div><!-- #content -->

		<?php if ( !is_front_page() ) { ?>

			<footer id="masthead" class="site-footer" role="banner">

				<div class="grid js-isotope" data-isotope-options='{ "percentPosition": "true", "itemSelector": ".grid-item", "layoutMode": "masonry", "transitionDuration": "0", "masonry": { "columnWidth": ".grid-sizer", "gutter": ".gutter-sizer" } }'>
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

			</footer><!-- #masthead -->

		<?php } ?>
	
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
