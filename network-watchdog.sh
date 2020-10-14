#!/bin/bash
# Original Source Attribution:
# Location: https://gist.github.com/SandroMachado/87e591fc42f368636b251b566485ae46
# Author: Sandro Machado
# Date of retrieval: 2020-01-25

# This script is intended to be ran via cron with the @reboot
# (see man 5 crontab) option so that it runs once at startup and
# continues execution in an infinite loop until a reboot
# condition is reached.

# The interval [sec] to check dmesg for connectivity.
check_interval=30

# The number of attempts
failed_attempts=0

# The max attempts before reload
max_failures=2

# Main
while true
do
  sleep $check_interval
  # new condition using dmesg
  if ! dmesg | tail -1 | grep -q fw_state; then
    failed_attempts=0
    echo 'OK:' $(date)
  elif ((failed_attempts < max_failures)); then
    ((failed_attempts+=1))
    echo 'KO:' $(date)
  else
    echo 'GO:' $(date) | tee --append /home/bin/network-info
    /sbin/modprobe -r r8723bs && /sbin/modprobe r8723bs
  fi
done
