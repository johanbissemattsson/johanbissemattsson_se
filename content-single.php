<?php
/**
 * @package johanbissemattsson
 */
?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<header class="entry-header">
				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

				<?php if ( get_field('entry_details')): ?>
					<span class="entry-details">
						<?php the_field('entry_details'); ?>
					</span>
				<?php endif; ?>

				<?php if ( has_post_thumbnail()): ?>
					<div class="featured-image">
						<?php the_post_thumbnail(); ?>
					</div>
				<?php endif; ?>				

			</header><!-- .entry-header -->

			<div class="entry-content">
				<?php the_content(); ?>
				<?php
					wp_link_pages( array(
						'before' => '<div class="page-links">' . __( 'Pages:', 'johanbissemattsson' ),
						'after'  => '</div>',
					) );
				?>
			</div><!-- .entry-content -->

			<footer class="entry-footer">
				<span>Previous</span><span>Next</span>
				<?php johanbissemattsson_entry_footer(); ?>
			</footer><!-- .entry-footer -->
		</article><!-- #post-## -->
