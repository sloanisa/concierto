<?php require_once '../includes/initialize.php'; ?>

<!DOCTYPE html>
<html lang="en">

<head>
	<!-- What it tries to add as homepage app name -->
	<title>Create Account</title>
	<!-- META -->
	<meta charset="utf-8">

	<!-- HACKS -->
	<!-- Prevent text size change on orientation change -->
	<style>
		html {
			-webkit-text-size-adjust: 100%;
		}
	</style>

</head>

<body>
	<!-- PAGE CONTENT -->

		<!-- Portrait View Start -->
		<div class="port_wrap">

					<form class="form-wrap" action="create_processing.php" method="post">
				    <div class="form-group_1">

				      <input type="text" name="username" id="username" value="Username">
				    </div>
				    <div class="form-group_2">

				      <input type="password" name="password" id="password" placeholder="Password">
				    </div>
                        <div class="form-group_3">

				      <input type="password" name="password-confirm" id="password-confirm" placeholder="Confirm a password">
				    </div>
						<div class="log-in_wrap" onclick="jmp2LocalPage('')">
								<button type="submit" name="submit" class="log-in">
									<h4>create account</h4>
								</button>
						</div>
                   




<a href="../login.php">

						<div class="no_account_wrap">
							<h4>have an account?</h4>
						</div>


				<div class="bottom_bar_wrap">
					<h3>Log In</h3>
				</div>
				</a>
				</form>

		</div>

		<!-- Portrait View End  -->


		<!-- Landscape View Start -->
		<div class="land_wrap">

		</div>

		<!-- Landscape View End -->

</body>

</html>
