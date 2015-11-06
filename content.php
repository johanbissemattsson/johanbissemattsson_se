<?php
/**
 * @package johanbissemattsson
 */
?>
<div class="grid-item">

			<a href="<?php the_permalink(); ?>" rel="bookmark">
				<?php if ( has_post_thumbnail() ) {
					the_post_thumbnail();
				} ?>

				<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>

				<?php if ( 'post' == get_post_type() ) : ?>
					<?php if(get_field('entry_details')): ?>
						<span class="entry-details">
							<?php the_field('entry_details'); ?>
						</span>
					<?php endif; ?>

				<?php endif; ?>

			</a>

</div>