<?php require_once 'includes/initialize.php'; ?>

<!DOCTYPE html>
<html lang="en">

<head>
	<!-- What it tries to add as homepage app name -->
	<title>Log-in</title>
    <!-- CSS -->
	<link rel="stylesheet" href="css/normalize.css">
	<!-- Add2Home Styling -->
	<link rel="stylesheet" href="css/css-add2home.css">
	<link rel="stylesheet" href="css/main.css">
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

					<form class="form-wrap" action="php/login_processing.php" method="post">
				    <div class="form-group_1">
				      <input type="text" name="username" id="username" placeholder="Username" onfocus="this.placeholder = ''">
				    </div>
				    <div class="form-group_2">
<!--				      <label for="password">Password</label>-->
				      <input type="password" name="password" id="password" placeholder="Password" onfocus="this.placeholder = ''">
				    </div>
						<div class="log-in_wrap" onclick="jmp2LocalPage('')">
								<button type="submit" name="submit" class="log-in">
									<h4>login</h4>
								</button>
						</div>




<a href="php/createAccount.php">

						<div class="no_account_wrap">
							<h4>no account?</h4>
						</div>

					<h3>Sign Up</h3>
				</a>
				</form>

		</div>

		<!-- Portrait View End  -->


		<!-- Landscape View Start -->
		<div class="land_wrap">

		</div>

		<!-- Landscape View End -->


	<!-- JAVASCRIPT-->
	<!-- JS to change config variables -->
	<script src="js/jquery-3.2.1.min.js"></script>
</body>

</html>
