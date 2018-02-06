<?php
include "global.php";

ConnectDB();

$sql = $_POST["sql"];

$result = mysqli_query($dc, $sql);

if (!$result)
{
  $message = 'SQL ERROR: ' . mysqli_error($dc);
  echo $message;
  return;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=utf-8");

$output = "[[";

$fieldnamesarray = array();
$fieldtypesarray = array();

$i = 0;
$rowcount = mysqli_num_fields($result);

while ($info = $result->fetch_field()) {
  if ($i != 0) {
    $output.= ",";
  }

  $output .= '{"name":"' . $info->name . '",';
  $output .= '"type":' . $info->type. '}';

  array_push($fieldnamesarray, $info->name);
  array_push($fieldtypesarray, $info->type);

  $i++;
}

$output .=  "]";

while ($row = mysqli_fetch_array($result)) {
  $output.= ",{";

  $i = 0;
  while($i < $rowcount) {
    if($i != 0)
      $output.= ",";

    $output.= '"'. $fieldnamesarray[$i] .'":';

    switch ($fieldtypesarray[$i]) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 8:
    case 9:
    case 13:
    case 16:
    case 246:
      $output.= CleanJSON($row[$i]);
      break;
    case 7:
    case 10:
    case 11:
    case 12:
    case 252:
    case 253:
    case 254:
    default:
      $output.= '"' . CleanJSON($row[$i]) . '"';
      break;
      }
    $i++;
  }
  $output.="}";
}
$output .="]";

echo($output);

mysqli_close($dc);
