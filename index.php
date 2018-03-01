<?php require_once 'includes/initialize.php'; ?>
<?php require_once 'includes/session.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
	<!-- What it tries to add as homepage app name -->
	<title>Concert Display Page</title>
    <!-- CSS -->
	<link rel="stylesheet" href="css/normalize.css">
	<!-- Add2Home Styling -->
	<link rel="stylesheet" href="css/css-add2home.css">
	<link rel="stylesheet" href="css/main.css">
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

			<div class="upcoming">
				<h2>Upcoming Events</h2>
				<div class="upcoming_events">
					<h4>You don't have any upcoming events!</h4>
				</div>
			</div>

            <a href="add_concert.php"><div class="plus_button">
				add concert
			</div>
            </a>
            

			<div class="my_journal">
				<h2>My Entries</h2>
                
            <?php
    
            $user_id = $_SESSION['user'];
    
            $query = 'SELECT * ';
            $query .= 'FROM concert_info WHERE';
            $query .= " user_id = '{$user_id}'";
            $query .= "ORDER BY concert_date ASC";
            $result = mysqli_query($connection, $query);
 
            if (!$result) {
              die('Database query failed.');
            }

//            $row = mysqli_fetch_row($result);
            
            while ($concert_info = mysqli_fetch_assoc($result)) { 
          ?>
				<div>
					<div class="flex" id="entry_flex">
                       
                    <div>
                    <form action="edit_concert.php" method="post" id="edit_entry">
                        <p>
                          <input type="text" name="headliner" id="headliner" value="<?php echo $concert_info['headliner']; ?>" class="uneeded">
                          </p>   
                        <p>
                          <input type="date" name="concert_date" id="concert_date" value="<?php echo $concert_info['concert_date']; ?>" class="uneeded">
                        </p>                 

                        <input type="submit" name="submit" id="concert_edit" value="Edit">
                    </form>
                    </div>
                        
                        <div class="concert_info">
						<h6><?php echo $concert_info['headliner']; ?></h6>
						<h6><?php echo $concert_info['concert_date']; ?></h6>
						<h6><?php echo $concert_info['venue']; ?></h6>
                        </div>
                        
                        <div>
                        <form action="journal_complete.php" method="post">
                        <button type="submit" name="submit">
                            <p>
                          <input type="text" name="headliner" id="headliner" value="<?php echo $concert_info['headliner']; ?>" class="uneeded">
                          </p>   
                        <p>
                          <input type="date" name="concert_date" id="concert_date" value="<?php echo $concert_info['concert_date']; ?>" class="uneeded">
                        </p>                 

                            </button>
                            </form>
                    </div>
            
				</div>
                
                        <?php
                        
          } 
        
        mysqli_free_result($result);
        ?>
        

			</div>
		</div>
    </div>
		<!-- Portrait View End  -->


		<!-- Landscape View Start -->
		<div class="land_wrap">

		</div>

		<!-- Landscape View End -->


	<!-- JAVASCRIPT-->
	<!-- JS to change config variables -->
	<script src="js/jquery-3.2.1.min.js"></script>
	<script type="text/javascript">
	    // Customize config variable BEFORE loading addToHome.js file this is how to change the parameters 
	    var addToHomeConfig = {
	      touchIcon: true
	    }
	</script>
	<script src="js/js-add2home.js"></script>
	<script src="js/main.js"></script>
</body>

</html>