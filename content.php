<?php
/**
 * @package johanbissemattsson
 */
?>
<div class="grid-item">
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'item' ); ?>>
		<header class="entry-header">

			<a href="<?php the_permalink(); ?>" rel="bookmark">
				<?php if ( has_post_thumbnail() ) {
					the_post_thumbnail();
				} ?>

				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

				<?php if ( 'post' == get_post_type() ) : ?>
					<?php if(get_field('entry_details')): ?>
						<div class="entry-details">
							<?php the_field('entry_details'); ?>
						</div>
					<?php endif; ?>

				<?php endif; ?>

			</a>

		</header><!-- .entry-header -->

		<footer class="entry-footer">
			<?php johanbissemattsson_entry_footer(); ?>
		</footer><!-- .entry-footer -->
	</article><!-- #post-## -->
</div>