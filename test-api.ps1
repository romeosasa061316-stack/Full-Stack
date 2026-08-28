$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:5000"
$passCount = 0
$failCount = 0

function Test-Case {
    param(
        [string]$Name,
        [scriptblock]$Test,
        [bool]$ExpectSuccess = $true
    )
    try {
        $result = & $Test
        if ($ExpectSuccess) {
            Write-Host "PASS: $Name" -ForegroundColor Green
            $script:passCount++
            return $result
        } else {
            Write-Host "FAIL: $Name (expected an error, but request succeeded)" -ForegroundColor Red
            $script:failCount++
            return $result
        }
    } catch {
        if ($ExpectSuccess) {
            Write-Host "FAIL: $Name" -ForegroundColor Red
            Write-Host "  -> $($_.Exception.Message)" -ForegroundColor DarkYellow
            $script:failCount++
            return $null
        } else {
            Write-Host "PASS: $Name (correctly rejected)" -ForegroundColor Green
            $script:passCount++
            return $null
        }
    }
}

Write-Host "`n===== DREAMTRIP API TEST SUITE =====`n" -ForegroundColor Cyan

# ---------- AUTH ----------
Write-Host "--- Auth ---" -ForegroundColor Cyan

$admin = Test-Case "Admin login (test@example.com)" {
    Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"test@example.com","password":"password123"}'
}

$passenger = Test-Case "Passenger login (passenger@example.com)" {
    Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"passenger@example.com","password":"password123"}'
}

Test-Case "Login with wrong password is rejected" -ExpectSuccess $false {
    Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"test@example.com","password":"wrongpassword"}'
}

Test-Case "Register with existing email is rejected" -ExpectSuccess $false {
    Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -ContentType "application/json" -Body '{"fullName":"Dup User","email":"test@example.com","phone":"0771234567","password":"password123"}'
}

Test-Case "Protected route blocks missing token" -ExpectSuccess $false {
    Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get
}

if ($admin) {
    Test-Case "Protected route allows valid token" {
        Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get -Headers @{ Authorization = "Bearer $($admin.token)" }
    }

    Test-Case "Admin-only route allows admin" {
        Invoke-RestMethod -Uri "$baseUrl/api/auth/admin-test" -Method Get -Headers @{ Authorization = "Bearer $($admin.token)" }
    }
}

if ($passenger) {
    Test-Case "Admin-only route blocks passenger" -ExpectSuccess $false {
        Invoke-RestMethod -Uri "$baseUrl/api/auth/admin-test" -Method Get -Headers @{ Authorization = "Bearer $($passenger.token)" }
    }
}

# ---------- BUS CRUD ----------
Write-Host "`n--- Bus CRUD ---" -ForegroundColor Cyan

$adminHeaders = @{ Authorization = "Bearer $($admin.token)" }
$passengerHeaders = @{ Authorization = "Bearer $($passenger.token)" }

$suffix = Get-Random -Maximum 99999
$newBus = Test-Case "Admin creates a bus" {
    Invoke-RestMethod -Uri "$baseUrl/api/buses" -Method Post -ContentType "application/json" -Headers $adminHeaders -Body "{`"busNumber`":`"TEST-$suffix`",`"registrationNumber`":`"REG-$suffix`",`"capacity`":50}"
}

Test-Case "Any logged-in user can view buses" {
    Invoke-RestMethod -Uri "$baseUrl/api/buses" -Method Get -Headers $passengerHeaders
}

Test-Case "Passenger blocked from creating a bus" -ExpectSuccess $false {
    Invoke-RestMethod -Uri "$baseUrl/api/buses" -Method Post -ContentType "application/json" -Headers $passengerHeaders -Body "{`"busNumber`":`"TEST2-$suffix`",`"registrationNumber`":`"REG2-$suffix`",`"capacity`":50}"
}

if ($newBus) {
    Test-Case "Admin updates the bus" {
        Invoke-RestMethod -Uri "$baseUrl/api/buses/$($newBus.bus.id)" -Method Put -ContentType "application/json" -Headers $adminHeaders -Body '{"capacity":55}'
    }
}

# ---------- ROUTE CRUD ----------
Write-Host "`n--- Route CRUD ---" -ForegroundColor Cyan

$newRoute = Test-Case "Admin creates a route" {
    Invoke-RestMethod -Uri "$baseUrl/api/routes" -Method Post -ContentType "application/json" -Headers $adminHeaders -Body "{`"origin`":`"Harare`",`"destination`":`"TestTown-$suffix`",`"distance`":100,`"duration`":90}"
}

Test-Case "Any logged-in user can view routes" {
    Invoke-RestMethod -Uri "$baseUrl/api/routes" -Method Get -Headers $passengerHeaders
}

Test-Case "Passenger blocked from creating a route" -ExpectSuccess $false {
    Invoke-RestMethod -Uri "$baseUrl/api/routes" -Method Post -ContentType "application/json" -Headers $passengerHeaders -Body "{`"origin`":`"Harare`",`"destination`":`"Blocked-$suffix`",`"distance`":100,`"duration`":90}"
}

# ---------- TRIP CRUD + BOOKING ----------
Write-Host "`n--- Trip + Booking ---" -ForegroundColor Cyan

$futureTrip = $null
if ($newRoute -and $newBus) {
    $futureTrip = Test-Case "Admin creates a future trip" {
        $futureDate = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
        Invoke-RestMethod -Uri "$baseUrl/api/trips" -Method Post -ContentType "application/json" -Headers $adminHeaders -Body "{`"routeId`":`"$($newRoute.route.id)`",`"busId`":`"$($newBus.bus.id)`",`"departureDate`":`"$futureDate`",`"departureTime`":`"09:00`",`"fare`":10}"
    }
}

Test-Case "Passenger blocked from creating a trip" -ExpectSuccess $false {
    Invoke-RestMethod -Uri "$baseUrl/api/trips" -Method Post -ContentType "application/json" -Headers $passengerHeaders -Body "{`"routeId`":`"x`",`"busId`":`"x`",`"departureDate`":`"2026-01-01`",`"departureTime`":`"09:00`",`"fare`":10}"
}

$booking = $null
if ($futureTrip) {
    $booking = Test-Case "Passenger books a valid seat" {
        Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method Post -ContentType "application/json" -Headers $passengerHeaders -Body "{`"tripId`":`"$($futureTrip.trip.id)`",`"seatNumber`":1}"
    }

    Test-Case "Duplicate seat booking is rejected" -ExpectSuccess $false {
        Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method Post -ContentType "application/json" -Headers $passengerHeaders -Body "{`"tripId`":`"$($futureTrip.trip.id)`",`"seatNumber`":1}"
    }
}

Test-Case "Passenger can view their booking history" {
    Invoke-RestMethod -Uri "$baseUrl/api/bookings/my-bookings" -Method Get -Headers $passengerHeaders
}

# ---------- NOTIFICATIONS ----------
Write-Host "`n--- Notifications ---" -ForegroundColor Cyan

$notifs = Test-Case "Passenger can view their notifications" {
    Invoke-RestMethod -Uri "$baseUrl/api/notifications" -Method Get -Headers $passengerHeaders
}

if ($notifs -and $notifs.notifications.Count -gt 0) {
    $notifId = $notifs.notifications[0].id
    Test-Case "Passenger marks own notification as read" {
        Invoke-RestMethod -Uri "$baseUrl/api/notifications/$notifId/read" -Method Put -Headers $passengerHeaders
    }

    Test-Case "Admin cannot mark passenger's notification as read" -ExpectSuccess $false {
        Invoke-RestMethod -Uri "$baseUrl/api/notifications/$notifId/read" -Method Put -Headers $adminHeaders
    }
}

# ---------- SUMMARY ----------
Write-Host "`n===== SUMMARY =====" -ForegroundColor Cyan
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
