<?php
/**
 * @package johanbissemattsson
 */
?>
		<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
			<header class="entry-header">
				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

				<?php if ( get_field('entry_details')): ?>
					<div class="entry-details">
						<?php the_field('entry_details'); ?>
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
				<?php johanbissemattsson_entry_footer(); ?>
			</footer><!-- .entry-footer -->
		</article><!-- #post-## -->
