#!/bin/bash

GATEWAY_PATH=/var/gateway
TURF_LOG=${NOSLATE_LOGDIR}/turf.log
CONTROL_PLANE_OUTPUT=${NOSLATE_LOGDIR}/control_plane_out.log
DATA_PLANE_OUTPUT=${NOSLATE_LOGDIR}/data_plane_out.log
GATEWAY_OUTPUT=${NOSLATE_LOGDIR}/gateway_out.log

log() {
  echo `date +"%F %T.%N"` $1
}

log_exit() {
  EXIT_CODE=$?
  echo $1 exited with $EXIT_CODE
  exit $EXIT_CODE
}

start_turf() {
  # turf need process group leader
  nohup ${NOSLATE_BIN}/turf -D -f >${TURF_LOG} 2>&1 || log_exit turfd &
  log "[Noslate - Turf] turfd started."
}

wait_panels() {
  while true; do
    wait
    for pid in $@; do
      if ! kill -0 $pid; then
        echo "[Noslate - wait] $pid exited"
        exit
      fi
    done
  done
}

start_planes() {
  ${NOSLATE_BIN}/node ${NOSLATE_BIN}/data_plane >${DATA_PLANE_OUTPUT} 2>&1 || log_exit data_plane &
  DATA_PLANE_PID=$!
  log "[Noslate - Noslated] data plane started as $DATA_PLANE_PID."
  ${NOSLATE_BIN}/node ${NOSLATE_BIN}/control_plane >${CONTROL_PLANE_OUTPUT} 2>&1 || log_exit control_plane &
  CONTROL_PLANE_PID=$!
  log "[Noslate - Noslated] control plane started as $CONTROL_PLANE_PID."
  ${NOSLATE_BIN}/node ${GATEWAY_PATH}/gateway >${GATEWAY_OUTPUT} 2>&1 || log_exit gateway &
  GATEWAY_PID=$!
  log "[Noslate - Gateway] started as $GATEWAY_PID."

  # exit the container once any of the subprocess exited unexpectically.
  wait_panels $DATA_PLANE_PID $CONTROL_PLANE_PID $GATEWAY_PID
}

start_turf
start_planes
